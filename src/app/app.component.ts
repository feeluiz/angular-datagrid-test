import { AfterContentInit, Component } from '@angular/core';

const generateFakeDataRows = (rowsNumber) => {
  const result = [];
  const all = rowsNumber;
  for (let j = 0; j < all; j++) {
    const row = j;
    if (!result[row]) {
      result[row] = {};
    }
    // tslint:disable-next-line:no-string-literal
    result[row]['name'] = `name ${row}`;
    // tslint:disable-next-line:no-string-literal
    result[row]['birthdate'] = `2021-08-05`;
    // tslint:disable-next-line:no-string-literal
    result[row]['details'] = row;
    Array.from({ length: 1000 }, (v, i) => result[row][`coll${i}`] = row);

  }
  return result;
};

const gc = () => {
  const columns = [
    {
      name: 'Birth',
      prop: 'birthdate',
      columnType: 'date',
      size: 200,
      pin: 'colPinStart',
    },
    {
      prop: 'name',
      name: 'First',
    },
    {
      prop: 'details',
      name: 'Second',
      sortable: true,
    },
  ];

  Array.from({ length: 1000 }, (v, i) => columns.push({prop: `coll${i}`, name: `coll${i}` }) );
  return columns;

};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
  columns = gc();
  rows = generateFakeDataRows(1000);


  types = {
    'date': new ColumnType()
  };

  constructor() {

  }

  ngAfterContentInit(): void {
  }


}

import { RevoGrid as IRev } from '@revolist/revogrid/dist/types/interfaces';
import { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime';
import { Edition } from '@revolist/revogrid/dist/types/interfaces';
import * as moment from 'moment';
class TextEditor {
  public element: Element | null = null;
  public editCell: Edition.EditCell | null = null;
  private renderedElement: HTMLElement | any | null = null;



  constructor(
    public column: any,
    public saveCallback: (value: any) => void,
    public closeCallback: () => void
  ) { }

  // optional, called after editor rendered
  componentDidRender(): any {
    setTimeout(() => {
      this.renderedElement = document.getElementById('currentDateInput');
      this.renderedElement.focus();
    }, 300);
  }

  // optional, called after editor destroyed
  disconnectedCallback(): any {
   }

  /**
   * required, define custom component structure
   * @param createElement: (tagName: string, properties?: object, value?: any, children: Array) => VNode
   */
  render(createComponent: IRev.HyperFunc<VNode>): any {
    const input = createComponent('input', {
      styles: { backgroundColor: 'black' },
      id: 'currentDateInput' ,
      type: 'date',
      value: this.editCell.model[this.editCell.prop],
      onblur: (event) => {
        console.log('saved', event.srcElement.value);
        this.saveCallback(event.srcElement.value);
      },
      onkeydown: (event: KeyboardEvent | any) => {
        if (event.key === 'Esc') {
          this.closeCallback();
          console.log('exit');
        }
        if (event.key === 'Enter') {
          this.renderedElement.blur();
        }

      }
    }, this.editCell.val);
    console.log(input);
    // input?.$elm$?.focus();
    return input;
  }
}


export class ColumnType {
  constructor() {
  }
  readonly editor = TextEditor;

  cellTemplate = (createElement, props) => {
    // console.log(props);
    return createElement('span', {
      style: {color: 'red'}

    }, moment(props.model[props.prop]).format('DD/MM/YYYY'));
  }


}
