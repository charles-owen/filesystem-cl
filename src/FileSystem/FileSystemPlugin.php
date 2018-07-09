<?php
/**
 * @file
 * Plugin for add users support to Site.
 */

namespace CL\FileSystem;

use CL\Site\Site;
use CL\Site\System\Server;
use CL\Users\Api\ApiUsers;

class FileSystemPlugin extends \CL\Site\Components\Plugin {
	public function install(Site $site) {
		$site->addPreStartup(function(Site $site, Server $server, $time) {
			return $this->preStartup($site, $server, $time);
		});

		$site->addPostStartup(function(Site $site, Server $server, $time) {
			return $this->postStartup($site, $server, $time);
		});

		$site->addApi('filesystem', function(Site $site, Server $server, array $params, $time) {
			$resource = new ApiFileSystem();
			return $resource->dispatch($site, $server, $params, $time);
		});
	}

	/**
	 * Handle activities prior to startup of the user system
	 *
	 * Ensure the tables exist
	 *
	 * @param Site $config
	 * @param Server $server
	 * @param int $time Current time
	 * @return null|string redirect page.
	 */
	private function preStartup(Site $config, Server $server, $time) {
		// Ensure tables exist...
		$filesystem = new FileSystem($config->db);
		if(!$filesystem->exists()) {
			$maker = new FileSystemTables($config->db);
			$maker->create(false);
		}

		return null;
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

}