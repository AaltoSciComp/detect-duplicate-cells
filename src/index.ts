import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';

import { Dialog } from '@jupyterlab/apputils';

function duplicateCellDialog() {
  const dialog = new Dialog({
    title: 'Duplicate cell detected.',
    body:
      'Notebook contains a cell with duplicate grade_id, which may break nbgrader. ' +
      'This may be caused by copy-pasting a nbgrader cell. ' +
      'Remove that cell and copy its contents instead.',
    buttons: [Dialog.okButton()]
  });
  return dialog.launch();
}

// minimal interface for what we need
interface INbgraderMetadata {
  grade_id?: string;
}

function activateExtension(app: JupyterFrontEnd, notebooks: INotebookTracker) {
  console.log('Activated duplicate-cells-detect');
  notebooks.widgetAdded.connect((_, panel) => {
    const notebookModel = panel.content.model;
    if (notebookModel === null) {
      return;
    }
    notebookModel.cells.changed.connect((cellList, change) => {
      if (change.type !== 'add') {
        return;
      }

      const grade_ids: string[] = [];
      for (const cell of cellList) {
        const metadata: INbgraderMetadata = cell.getMetadata('nbgrader');
        if (metadata && metadata.grade_id) {
          grade_ids.push(metadata.grade_id);
        }
      }
      const set = new Set(grade_ids);
      if (set.size !== grade_ids.length) {
        return duplicateCellDialog();
      }
    });
  });
}

/**
 * Initialization data for the duplicate-cells-detect extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'duplicate-cells-detect:plugin',
  description: 'A JupyterLab extension to detect duplicate cells for nbgrader',
  autoStart: true,
  requires: [INotebookTracker],
  activate: activateExtension
};

export default plugin;
