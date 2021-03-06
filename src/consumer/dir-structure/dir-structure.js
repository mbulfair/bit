// @flow
import R from 'ramda';
import { DEFAULT_COMPONENTES_DIR_PATH, DEFAULT_DEPENDENCIES_DIR_PATH } from '../../constants';
import GeneralError from '../../error/general-error';

export default class BitStructure {
  componentsDefaultDirectory: string;
  dependenciesDirectory: string;
  constructor(componentsDefaultDirectory, dependenciesDirectory) {
    this.componentsDefaultDirectory = componentsDefaultDirectory || DEFAULT_COMPONENTES_DIR_PATH;
    this.dependenciesDirectory = dependenciesDirectory || DEFAULT_DEPENDENCIES_DIR_PATH;
  }

  _getComponentStructurePart(componentStructure: string, componentPart: string): string {
    switch (componentPart) {
      case 'name':
        return 'name';
      case 'namespace':
        return 'box';
      case 'scope':
        return 'scope';
      case 'version':
        return 'version';
      default:
        throw new GeneralError(`the ${componentPart} part of the component structure
           ${componentStructure} is invalid, it must be one of the following: "name", "namespace", "scope" or "version" `);
    }
  }

  get dependenciesDirStructure(): string {
    return this.dependenciesDirectory;
  }

  get componentsDirStructure(): Object {
    const dirStructure = this.componentsDefaultDirectory;
    const staticParts = [];
    const dynamicParts = [];
    dirStructure.split('/').forEach((dir) => {
      if (dir.startsWith('{') && dir.endsWith('}')) {
        // this is a variable
        const dirStripped = dir.replace(/[{}]/g, '');
        const componentPart = this._getComponentStructurePart(dirStructure, dirStripped);
        dynamicParts.push(componentPart);
      } else {
        // todo: create a new exception class
        if (!R.isEmpty(dynamicParts)) {
          throw new GeneralError(`${dirStructure} is invalid, a static directory can not be after the dynamic part`);
        }
        staticParts.push(dir);
      }
    });

    return { staticParts, dynamicParts };
  }
}
