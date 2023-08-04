import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the detect-duplicate-cells extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'detect-duplicate-cells:plugin',
  description: 'A JupyterLab extension to detect duplicate cells for nbgrader.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension detect-duplicate-cells is activated!');
  }
};

export default plugin;
