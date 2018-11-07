import React, { Component } from 'react';

import styles from './List.scss';

export default function List(props) {
  return (
    <div>
        {props.items.map(item => <AccordionButton item={item} onClickSubitem={props.onClickSubitem} key={item.name}/>)}
    </div>
  );
}

class AccordionButton extends Component {
  constructor (props) {
    super(props);
    this.state = {dropdown: false};
  }

    Clicked = (event) => {
        event.preventDefault();

        this.setState({
            dropdown: !this.state.dropdown,
        });
    };

    SubButtons = (sites) => {
        return (
            sites.map(site => (
                <button className={styles.accordion} onClick={() => this.props.onClickSubitem(site.id)} key={site.name}>
                    {site.name}
                </button>
            ))
        )
    };

  render() {
      return (
          <>
              <button className={styles.accordion} onClick={this.Clicked}>
                  {this.props.item.name}
              </button>

              <div className={this.state.dropdown ? styles.panel2 : styles.panel}>
                  {this.SubButtons(this.props.item.items)}
              </div>
          </>
      )
  }
}