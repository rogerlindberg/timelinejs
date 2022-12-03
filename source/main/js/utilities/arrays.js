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


// Count the items in the itemList that fullfills the rules of
// the selectorFunction.
function count(itemList, selectorFunction) {
	return itemList.reduce(
		(acc, item) => selectorFunction(item) ? acc + 1 : acc, 0)
}

// Extending the Array class with the count function
Array.prototype.count = function(selectorFunction){
	return count(this, selectorFunction);
};

// Delete the given item from the itemList.
// Returns true if the item was found, otherwise it returns false;
function deleteItem(itemList, item) {
	let inx = itemList.findIndex(li => li == item);
	if (inx != -1) {
		itemList.splice(inx, 1);
		return true;
	}
	return false;
}

// Extending the Array class with the deleteItem function
Array.prototype.deleteItem = function(item){
	return deleteItem(this, item);
};

// Create a new array with items from the itemList that fullfills the
// rules of the selectorFunction.
function extract(itemList, selectorFunction) {
	return itemList.reduce(
		(acc, item) => selectorFunction(item) ? (acc.push(item) ? acc : acc) : acc, [])
}

// Extending the Array class with the extract function
Array.prototype.extract = function(selectorFunction){
	return extract(this, selectorFunction);
};

// Create a new array with items in the itemList, transformed by the
// given transformationFunction.
function transform(itemList, transformationFunction) {
	return itemList.reduce(
		(acc, item) => acc.push(transformationFunction(item)) ? acc : acc, []);
}

// Extending the Array class with the transform function
Array.prototype.transform = function(transformationFunction){
	return transform(this, transformationFunction);
};

// Return true if the item is found in the list.
function hasItem(itemList, item) {
	let inx = itemList.findIndex(li => li == item);
	if (inx != -1) {
		return true;
	}
	return false;
}

// Extending the Array class with the hasItem function
Array.prototype.hasItem = function(item){
	return hasItem(this, item);
};

// Return true if the selectorFunction generates any hits.
function exists(itemList, selectorFunction) {
	return itemList.reduce(
		(acc, item) => selectorFunction(item) ? (acc.push(item) ? acc : acc) : acc, []).length > 0;
}

// Extending the Array class with the exists function
Array.prototype.exists = function(selectorFunction){
	return exists(this, selectorFunction);
};
