<?php
/**
 * @file
 * Plugin that adds support for a basic file system to the site.
 */

/// Classes in the FileSystem subsystem
namespace CL\FileSystem;

use CL\Site\Site;
use CL\Site\System\Server;
use CL\Console\ConsoleView;
use CL\Site\Router;

/**
 * Plugin that adds support for a basic file system to the site.
 */
class FileSystemPlugin extends \CL\Site\Plugin {
	/**
	 * A tag that represents this plugin
	 * @return string A tag like 'course', 'users', etc.
	 */
	public function tag() {return 'filesystem';}

	/**
	 * Return an array of tags indicating what plugins this one is dependent on.
	 * @return array of tags this plugin is dependent on
	 */
	public function depends() {return ['console', 'users'];}

	/**
	 * Amend existing object
	 * The Router is amended with routes for the login page
	 * and for the user API.
	 * @param $object Object to amend.
	 */
	public function amend($object) {
		if($object instanceof Router) {
			$router = $object;
			$router->addRoute(['filesystem', 'download', ':id'], function(Site $site, Server $server, array $params, array $properties, $time) {
				$view = new FileDownload($site, $server, $properties);
				return $view->whole();
			});

			$router->addRoute(['filesystem', 'view', ':id'], function(Site $site, Server $server, array $params, array $properties, $time) {
				$view = new FileView($site, $server, $properties);
				return $view->whole();
			});

			$router->addRoute(['api', 'filesystem', '*'], function(Site $site, Server $server, array $params, array $properties, $time) {
				$resource = new ApiFileSystem();
				return $resource->apiDispatch($site, $server, $params, $properties, $time);
			});
		} else if($object instanceof ConsoleView) {
			$object->addJS('filesystemconsole');
		}
	}


	/**
	 * Ensure tables exist for a given subsystem.
	 * @param Site $site The site configuration component
	 */
	public function ensureTables(Site $site) {
		$maker = new FileSystemTables($site->db);
		$maker->create(false);
	}

}