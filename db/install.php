<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * This file replaces the legacy STATEMENTS section in db/install.xml,
 *
 * lib.php/modulename_install() post installation hook and partially defaults.php
 *
 * @package   mod_skype
 * @copyright 2011 Amr Hourani a.hourani@gmail.com <your@email.adress>
 * @copyright 2020 onwards AL Rachels (drachels@drachels.com)
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die; // @codingStandardsIgnoreLine

/**
 * Post installation procedure
 */
function xmldb_skype_install() {
    global $DB, $CFG;

    // NOTE: I think I will also need to create an uninstall.php file to get rid of these entries as well as all
    // the user_info_data with the skype fieldid.

    if ($CFG->branch > 310) {
        // Check to see if, Other field, category exists by trying to get a db record containing it.
        $params = [
            'name' => 'Other fields',
        ];
        if (!$DB->get_record('user_info_category', $params)) {
            // If, Other fields, not there then in add it.
            $params = [
                'name' => 'Other fields',
                'sortorder' => 1,
            ];
            $DB->insert_record('user_info_category', $params);
        }
        // Now get the record we just made get the id to use as categoryid.
        // NOTE: I think this needs to be OUT of the if, in case, Other fields is already there!
        // Need to test this!
        $temp = $DB->get_record('user_info_category', $params);

        // Check to see if skype is in the user_info_field table already.
        $params = [
            'shortname' => 'skype',
        ];
        if (!$DB->get_record('user_info_field', $params)) {
            // If not there, then add it along with other details.
            $params = [
                'shortname' => 'skype',
                'name' => 'skype',
                'datatype' => 'social',
                'description' => 'Individual Skype user name.',
                'descriptionformat' => 1,
                'categoryid' => $temp->id,
                'sortorder' => 1,
                'required' => 0,
                'locked' => 0,
                'visible' => 2,
                'forceunique' => 1,
                'signup' => 0,
                'defaultdata' => '',
                'defaultdataformat' => 0,
                'param1' => 30,
                'param2' => 50,
                'param3' => 0,
                'param4' => '',
                'param5' => '',
            ];
            // Write a db record with the params.
            $DB->insert_record('user_info_field', $params);
        }
    }
    return true;
}

/**
 * Post installation recovery procedure.
 *
 * @see upgrade_plugins_modules()
 */
function xmldb_skype_install_recovery() {
    return true;
}
