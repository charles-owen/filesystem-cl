<?php
/**
 * @file
 * Plugin for add users support to Site.
 */

namespace CL\FileSystem;

use CL\Site\Site;
use CL\Site\System\Server;
use CL\Users\Api\ApiUsers;

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


	public function install(Site $site) {
		$this->site = $site;

		$site->addPostStartup(function(Site $site, Server $server, $time) {
			return $this->postStartup($site, $server, $time);
		});
	}


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
				$view = new FileView($site, $properties);
				return $view->whole();
			});

			$router->addRoute(['api', 'filesystem', '*'], function(Site $site, Server $server, array $params, array $properties, $time) {
				$resource = new ApiFileSystem();
				return $resource->apiDispatch($site, $server, $params, $properties, $time);
			});
		}
	}


	/**
	 * System is started, perform any validation required
	 * @param Site $site
	 * @param Server $server
	 * @param int $time Current time
	 * @return null|string redirect page.
	 */
	private function postStartup(Site $site, Server $server, $time) {
		//
		// Install in the control panel
		//
		$site->console->addPlugin('filesystemconsole', []);

		return null;
	}

	/**
	 * Ensure tables exist for a given subsystem.
	 * @param Site $site The site configuration component
	 */
	public function ensureTables(Site $site) {
		$maker = new FileSystemTables($site->db);
		$maker->create(false);
	}

	private $site = null;
}