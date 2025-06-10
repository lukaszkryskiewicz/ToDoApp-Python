import { initAddList } from './addList.js';
import { initAddItem }  from './addItem.js';
import { initEditList, initToggleFav } from './editList.js';

document.addEventListener('DOMContentLoaded', () => {
  initAddList();
  initAddItem();
  initEditList();
  initToggleFav();
});