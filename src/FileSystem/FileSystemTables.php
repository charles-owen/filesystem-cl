<?php
/**
 * @file
 * Class that provides functions to create and delete all FileSystem tables
 */

namespace CL\FileSystem;

use CL\Tables\Config;

/**
 * Class that provides functions to create and delete all File System tables
 *
 * It is used by the management system to create the necessary tables as needed.
 */
class FileSystemTables extends \CL\Tables\TableMaker {
	/**
	 * FileSystemTables constructor.
	 * @param Config $config
	 */
	public function __construct(Config $config) {
		parent::__construct($config);

        $this->add(new FileSystem($config));
    }
}