'use strict';

import React, { Component } from 'react'
import { View, NativeMethodsMixin, Dimensions } from 'react-native'

export default class InViewPort extends Component {
  constructor(props) {
    super(props)
    this.state = { rectTop: 0, rectBottom: 0 }
  }

  componentDidMount() {
    if (!this.props.disabled) {
      this.startWatching()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.disabled) {
      this.lastValue = null
      this.startWatching()
    }
  }

  startWatching() {
    if (!this.myview) {
      return
    }
    this.myview.measure((x, y, width, height, pageX, pageY) => {
      this.setState({
        rectTop: pageY,
        rectBottom: pageY + height,
        rectWidth: pageX + width
      })
    })
    this.isInViewPort()
  }

  isInViewPort() {
    const window = Dimensions.get('window')
    const isVisible =
      this.state.rectBottom !== 0 &&
      this.state.rectTop >= 0 &&
      this.state.rectBottom <= window.height &&
      this.state.rectWidth > 0 &&
      this.state.rectWidth <= window.width
    if (this.lastValue !== isVisible) {
      this.lastValue = isVisible
      this.props.onChange(isVisible)
    }
  }

  render() {
    return (
      <View
        collapsable={false}
        ref={component => {
          this.myview = component
        }}
        {...this.props}
      >
        {this.props.children}
      </View>
    )
  }
}
