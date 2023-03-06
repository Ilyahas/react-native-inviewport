'use strict';

import React, { Component } from 'react'
import { View, NativeMethodsMixin, Dimensions, LayoutAnimation } from 'react-native'

export default class InViewPort extends Component {
  constructor(props) {
    super(props)
    this.state = {rectTop: 0, rectBottom: 0, rectLeft: 0, rectRight: 0}
    this.pendingAnimation = false
  }

  componentDidMount() {
    if (!this.props.disabled) {
      this.startWatching()
    }
  }

  componentWillUnmount() {
    this.stopWatching()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.disabled) {
      this.stopWatching()
    } else {
      this.lastValue = null
      this.startWatching()
    }
  }

  startWatching() {
    if (this.interval) {
      return
    }
    this.interval = setInterval(() => {
      if (!this.myview) {
        return
      }
      if (!this.pendingAnimation) {
        this.pendingAnimation = true
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
            duration: this.props.animationDelay || 100
          }
        })
        this.myview.measure((x, y, width, height, pageX, pageY) => {
          this.setState({
            rectTop: pageY,
            rectBottom: pageY + height,
            rectLeft: pageX,
            rectRight: pageX + width
          }, () => {
            this.isInViewPort()
            this.pendingAnimation = false
          })
        })
      }
    }, this.props.delay || 1000)
  }

  stopWatching() {
    this.interval = clearInterval(this.interval)
  }

  isInViewPort() {
    const window = Dimensions.get('window')
    const isVisible =
      this.state.rectRight != 0 &&
      this.state.rectLeft >= 0 &&
      this.state.rectRight <= window.width &&
      this.state.rectBottom != 0 &&
      this.state.rectTop >= 0 &&
      this.state.rectBottom <= window.height
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
