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
 * File for handling Skype uninstall.
 *
 * @package    mod_skype
 * @copyright  2021 AL Rachels drachels@drachels.com
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later.
 */

defined('MOODLE_INTERNAL') || die;

/**
 * Custom uninstallation procedure
 */
function xmldb_skype_uninstall() {
    global $DB, $CFG;
    if ($CFG->branch > 310) {
        // Check to see if skype is in the user_info_field table.
        $params1 = array(
            'shortname' => 'skype'
        );
        // Get the record if it exists.
        $temp = $DB->get_record('user_info_field', $params1);
        if ($temp) {
            $params2 = array(
                'fieldid' => $temp->id
            );
            // Delete any records that exists that use the profile field.
            $DB->delete_records('user_info_data', null, $params2);
            // Delete the Skype ID profile entry.
            $DB->delete_records('user_info_field', null, $params1);
        }
    }
    // Also delete all the Skype activity instances.
    $DB->delete_records('skype', null);
    return true;
}
