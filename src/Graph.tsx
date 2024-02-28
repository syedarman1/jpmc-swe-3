import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    // Updated schema to include new fields for ratio, bounds, and trigger alert
    const schema = {
      timestamp: 'date',
      ratio: 'float',
      upper_bound: 'float',
      lower_bound: 'float',
      trigger_alert: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      elem.load(this.table);
      // Set the perspective viewer attributes according to new requirements
      elem.setAttribute('view', 'y_line');
      elem.removeAttribute('column-pivots'); // Remove column pivots as we're no longer distinguishing between stocks
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "upper_bound", "lower_bound", "trigger_alert"]');
      elem.setAttribute('aggregates', JSON.stringify({
        timestamp: 'distinct count',
        ratio: 'avg',
        upper_bound: 'avg',
        lower_bound: 'avg',
        trigger_alert: 'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      const rowData = DataManipulator.generateRow(this.props.data);

      // Attempt to assert the type directly to the expected type by the update method
      this.table.update([
        rowData as unknown as Record<string, any>, // Adjust the type assertion as needed
      ]);
    }
  }
}

export default Graph;


