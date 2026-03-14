<?php
/**
 * Plugin Name: CruiseSEO Connect
 * Description: Connects your WordPress site to CruiseSEO for one-click AI publishing.
 * Version: 1.0.0
 * Author: CruiseSEO
 * Author URI: https://cruiseseo.site
 */
if (!defined('ABSPATH')) exit;

// ── Generate API key on activation ──────────────────────────────
register_activation_hook(__FILE__, function() {
    if (!get_option('cruiseseo_api_key')) {
        update_option('cruiseseo_api_key', 'csk_' . bin2hex(random_bytes(20)));
    }
});

// ── CORS headers — fires before anything else ────────────────────
add_action('init', function() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if (strpos($origin, 'cruiseseo.site') !== false) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-CruiseSEO-Key');
        header('Access-Control-Max-Age: 86400');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
    }
}, 1);

// Also ensure CORS on REST responses
add_filter('rest_pre_serve_request', function($value) {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if (strpos($origin, 'cruiseseo.site') !== false) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-CruiseSEO-Key');
    }
    return $value;
}, 1);

// ── REST API endpoints ───────────────────────────────────────────
add_action('rest_api_init', function() {
    $auth = function($request) {
        $key = $request->get_header('X-CruiseSEO-Key') ?: $request->get_param('key');
        return $key === get_option('cruiseseo_api_key');
    };

    // Test connection
    register_rest_route('cruiseseo/v1', '/test', [
        'methods' => 'GET',
        'callback' => function() {
            return new WP_REST_Response(['ok' => true, 'name' => get_bloginfo('name')]);
        },
        'permission_callback' => $auth,
    ]);

    // Publish a post
    register_rest_route('cruiseseo/v1', '/publish', [
        'methods' => 'POST',
        'callback' => function($req) {
            $p = $req->get_json_params();
            if (empty($p['title']) || empty($p['content'])) {
                return new WP_Error('missing_fields', 'title and content required', ['status' => 400]);
            }
            $args = [
                'post_title'   => sanitize_text_field($p['title']),
                'post_content' => wp_slash($p['content']),
                'post_status'  => sanitize_text_field($p['status'] ?? 'publish'),
                'post_excerpt' => sanitize_text_field($p['excerpt'] ?? ''),
            ];
            if (!empty($p['date'])) $args['post_date'] = $p['date'];
            $id = wp_insert_post($args, true);
            if (is_wp_error($id)) return new WP_Error('publish_failed', $id->get_error_message(), ['status' => 500]);
            return new WP_REST_Response(['ok' => true, 'id' => $id, 'link' => get_permalink($id), 'url' => get_permalink($id), 'title' => get_the_title($id)]);
        },
        'permission_callback' => $auth,
    ]);

    // Get recent posts
    register_rest_route('cruiseseo/v1', '/posts', [
        'methods' => 'GET',
        'callback' => function() {
            $posts = get_posts(['numberposts' => 20, 'post_status' => 'publish', 'orderby' => 'date', 'order' => 'DESC']);
            $result = array_map(function($p) {
                return ['id' => $p->ID, 'title' => ['rendered' => esc_html($p->post_title)], 'link' => get_permalink($p->ID), 'date' => $p->post_date, 'excerpt' => ['rendered' => ''], 'featured_media' => get_post_thumbnail_id($p->ID) ?: 0];
            }, $posts);
            return new WP_REST_Response(['ok' => true, 'posts' => $result]);
        },
        'permission_callback' => $auth,
    ]);

    // Get a single post
    register_rest_route('cruiseseo/v1', '/post/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => function($req) {
            $post = get_post((int)$req['id']);
            if (!$post) return new WP_Error('not_found', 'Post not found', ['status' => 404]);
            return new WP_REST_Response(['ok' => true, 'content' => apply_filters('the_content', $post->post_content), 'title' => $post->post_title]);
        },
        'permission_callback' => $auth,
    ]);

    // Update a post
    register_rest_route('cruiseseo/v1', '/post/(?P<id>\d+)', [
        'methods' => 'POST',
        'callback' => function($req) {
            $p = $req->get_json_params();
            $args = ['ID' => (int)$req['id']];
            if (!empty($p['title']))   $args['post_title']   = sanitize_text_field($p['title']);
            if (!empty($p['content'])) $args['post_content'] = wp_slash($p['content']);
            $id = wp_update_post($args, true);
            if (is_wp_error($id)) return new WP_Error('update_failed', $id->get_error_message(), ['status' => 500]);
            return new WP_REST_Response(['ok' => true, 'link' => get_permalink($id)]);
        },
        'permission_callback' => $auth,
    ]);
});

// ── Admin settings page ──────────────────────────────────────────
add_action('admin_menu', function() {
    add_options_page('CruiseSEO Connect', 'CruiseSEO Connect', 'manage_options', 'cruiseseo-connect', function() {
        $key = get_option('cruiseseo_api_key', '');
        $url = get_site_url();
        ?>
        <div class="wrap">
            <h1>CruiseSEO Connect</h1>
            <p>Your site is connected. Copy the details below into <strong>CruiseSEO → Publish → Connect WordPress</strong>.</p>
            <table class="form-table">
                <tr><th>Site URL</th><td><code><?php echo esc_html($url); ?></code> &nbsp;
                    <button class="button" onclick="navigator.clipboard.writeText('<?php echo esc_js($url); ?>');this.textContent='Copied!'">Copy</button>
                </td></tr>
                <tr><th>API Key</th><td><code><?php echo esc_html($key); ?></code> &nbsp;
                    <button class="button button-primary" onclick="navigator.clipboard.writeText('<?php echo esc_js($key); ?>');this.textContent='Copied!'">Copy API Key</button>
                </td></tr>
            </table>
            <p style="color:#666;margin-top:20px">Need help? Visit <a href="https://cruiseseo.site" target="_blank">cruiseseo.site</a></p>
        </div>
        <?php
    });
});
