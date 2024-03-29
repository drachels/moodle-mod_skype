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
 * This file keeps track of upgrades to the skype module
 *
 * Sometimes, changes between versions involve alterations to database
 * structures and other major things that may break installations. The upgrade
 * function in this file will attempt to perform all the necessary actions to
 * upgrade your older installation to the current version. If there's something
 * it cannot do itself, it will tell you what you need to do.  The commands in
 * here will all be database-neutral, using the functions defined in DLL libraries.
 *
 * @package   mod_skype
 * @copyright 2011 Amr Hourani a.hourani@gmail.com
 * @copyright 2020 onwards AL Rachels (drachels@drachels.com)
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die(); // @codingStandardsIgnoreLine

/**
 * xmldb_skype_upgrade
 *
 * @param int $oldversion
 * @return bool
 */
function xmldb_skype_upgrade($oldversion) {

    global $CFG, $DB;

    $dbman = $DB->get_manager(); // Loads ddl manager and xmldb classes.

    // First example, some fields were added to install.xml on 2007/04/01.
    if ($oldversion < 2007040100) {

        // Define field course to be added to skype.
        $table = new xmldb_table('skype');
        $field = new xmldb_field('course', XMLDB_TYPE_INTEGER, '10', XMLDB_UNSIGNED, XMLDB_NOTNULL, null, '0', 'id');

        // Add field course.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Define field intro to be added to skype.
        $table = new xmldb_table('skype');
        $field = new xmldb_field('intro', XMLDB_TYPE_TEXT, 'medium', null, null, null, null, 'name');

        // Add field intro.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Define field introformat to be added to skype.
        $table = new xmldb_table('skype');
        $field = new xmldb_field('introformat', XMLDB_TYPE_INTEGER, '4', XMLDB_UNSIGNED, XMLDB_NOTNULL, null, '0',
            'intro');

        // Add field introformat.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
        // Skype savepoint reached.
        upgrade_mod_savepoint(true, 2007040100, 'skype');
    }

    if ($oldversion < 2007040101) {

        // Define field timecreated to be added to skype.
        $table = new xmldb_table('skype');
        $field = new xmldb_field('timecreated', XMLDB_TYPE_INTEGER, '10', XMLDB_UNSIGNED, XMLDB_NOTNULL, null, '0',
            'introformat');

        // Add field timecreated.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Define field timemodified to be added to skype.
        $table = new xmldb_table('skype');
        $field = new xmldb_field('timemodified', XMLDB_TYPE_INTEGER, '10', XMLDB_UNSIGNED, XMLDB_NOTNULL, null, '0',
            'timecreated');

        // Add field timemodified.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Define index course (not unique) to be added to skype.
        $table = new xmldb_table('skype');
        $index = new xmldb_index('courseindex', XMLDB_INDEX_NOTUNIQUE, ['course']);

        // Add index to course field.
        if (!$dbman->index_exists($table, $index)) {
            $dbman->add_index($table, $index);
        }
        // Skype savepoint reached.
        upgrade_mod_savepoint(true, 2007040101, 'skype');
    }

    if ($oldversion < 2019090902) {

        // Define field timeopen to be added to skype.
        $table = new xmldb_table('skype');
        $field = new xmldb_field('timeopen', XMLDB_TYPE_INTEGER, '10', XMLDB_UNSIGNED, XMLDB_NOTNULL, null, '0', 'timemodified');

        // Add field timeopen.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Define field timeclose to be added to skype.
        $table = new xmldb_table('skype');
        $field = new xmldb_field('timeclose', XMLDB_TYPE_INTEGER, '10', XMLDB_UNSIGNED, XMLDB_NOTNULL, null, '0', 'timeopen');

        // Add field timeclose.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Skype savepoint reached.
        upgrade_mod_savepoint(true, 2019090902, 'skype');
    }

    if ($CFG->branch > 310 && $oldversion < 2022062900) {
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

        // Skype savepoint reached.
        upgrade_mod_savepoint(true, 2022062900, 'skype');
    }

    // Final return of upgrade result (true, all went good) to Moodle.
    return true;
}
