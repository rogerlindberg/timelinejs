/*
  Copyright (C) 2021  Roger Lindberg, Rickard Lindberg

  This file is part of TimelineJs.

  TimelineJs is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  TimelineJs is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with TimelineJs.  If not, see <http://www.gnu.org/licenses/>.
*/

const CATEGORIES_DLGID = "edit-categories";
const CATEGORIES_LSTID = "category-names";
const CATEGORIES_LSTKEY = "name";
const CATEGORY_DEFAULT_COLOR = "127,127,127";
const CATEGORY_HTML_INPUT_FIELDS = [
    "category-name",
    "category-color",
    "category-hidden",
];
const CATEGORY_FIELDS = {
    "name": CATEGORY_HTML_INPUT_FIELDS[0],
    "color": CATEGORY_HTML_INPUT_FIELDS[1],
    "hidden": CATEGORY_HTML_INPUT_FIELDS[2],
}

//
// Handle Edit Categories Dialog
//

//
// Add an event listener
//
window.addEventListener("load", function () {
    addDialogEventListener(CATEGORIES_DLGID, _handleEditCategoriesDialog);
});

//
// Dialog initialization
//
function openEditCategoriesDialog() {
    if (repo) {
        _populateEditCategoriesDialog();
        showDialog(CATEGORIES_DLGID);
    }
}

function _populateEditCategoriesDialog() {
    fillListbox(CATEGORIES_LSTID, repo.categories, CATEGORIES_LSTKEY);
    _fillCategoryData();
}

function _fillCategoryData(category=undefined) {
    if (category) {
        setElementValue(CATEGORY_FIELDS.name, category.name);
        setElementValue(CATEGORY_FIELDS.color, rgbToHexString(`${category.color}`));
        setElementChecked(CATEGORY_FIELDS.hidden, category.hidden);
    } else {
        setElementValue(CATEGORY_FIELDS.name, "");
        setElementValue(CATEGORY_FIELDS.color, rgbToHexString(CATEGORY_DEFAULT_COLOR));
        setElementChecked(CATEGORY_FIELDS.hidden, false);
    }
}

//
// Event handler called on categories listbox selection change
//
function fillCategoryData() {
    let category = repo.categoryFromName(getElementValue(CATEGORIES_LSTID));
    if (category) {
        _fillCategoryData(category);
    }
}

//
// Process the values entered in the dialog
//
function _handleEditCategoriesDialog(e) {
    try {
        return {
            "New": _newCategory,
            "Delete": _deleteCategory,
            "OK": _updateCategory,
        }[e.submitter.innerHTML](getFieldsFromEditCategoriesDialog(e));
    }
    catch (error) {
        return error;
    }
}

function getFieldsFromEditCategoriesDialog(e) {
    return {
        "categoryName": e.target[1].value,
        "name": e.target[2].value,
        "color": hexToRgbString(e.target[3].value),
        "hidden": e.target[4].checked,
        "category": repo.categoryFromName(e.target[1].value),
    }
}

function _newCategory(input) {
    _validateNewCategory(input);
    repo.addCategory(new Category(input.name, input.color));
}

function _validateNewCategory(input) {
    mandatoryField("Name", input.name);
    if (_categoryExists(input.name)) {
        throw Error("The Category already exists");
    }
}

function _deleteCategory(input) {
    _validateDeleteCategory(input);
    _removeCategoryFromEvents(input);
    repo.categories.deleteItem(input.category);
    drawTimeline();
}

function _validateDeleteCategory(input) {
    if (!_categoryExists(input.categoryName)) {
        throw Error("Nothing to delete!");
    }
}

function _removeCategoryFromEvents(input) {
    for (const evt of repo.events) {
        if (evt.category == input.categoryName) {
            evt.category = "";
            evt.color = evt.defaultColor;
        }
    }
}

function _updateCategory(input) {
    _validateUdateCategory(input);
    input.category.name = input.name;
    input.category.color = input.color;
    input.category.hidden = input.hidden;
    _updateEvents(input)
    drawTimeline();
}

function _validateUdateCategory(input) {
    mandatoryField("Name", input.name);
    if (!_categoryExists(input.categoryName)) {
        throw Error("Can't find the category!");
    }
}

function _updateEvents(input) {
    for (const evt of repo.events.extract(e => e.category == input.categoryName)) {
        evt.category = input.name;
        evt.color = input.color;
    }
}

function _categoryExists(name) {
    return repo.categories.exists(cat => cat.name == name);
}
