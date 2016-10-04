import cx from 'classnames'
import React, { PropTypes, createElement } from 'react'

import {
  customPropTypes,
  getElementType,
  getUnhandledProps,
  META,
  SUI,
  useKeyOnly,
  useWidthProp,
} from '../../lib'
import Checkbox from '../../modules/Checkbox'
import Radio from '../../addons/Radio'

/**
 * A field is a form element containing a label and an input
 * @see Form
 * @see Button
 * @see Checkbox
 * @see Dropdown
 * @see Input
 * @see Radio
 * @see Select
 * @see TextArea
 */
function FormField(props) {
  const { control, children, className, disabled, error, inline, label, required, type, width } = props
  const classes = cx(
    useKeyOnly(error, 'error'),
    useKeyOnly(disabled, 'disabled'),
    useKeyOnly(inline, 'inline'),
    useKeyOnly(required, 'required'),
    useWidthProp(width, 'wide'),
    'field',
    className,
  )
  const rest = getUnhandledProps(FormField, props)
  const ElementType = getElementType(FormField, props)

  // ----------------------------------------
  // No Control
  // ----------------------------------------

  if (!control) {
    // TODO add test for label/no label when no control
    if (!label) return <ElementType {...rest} className={classes}>{children}</ElementType>

    return (
      <ElementType {...rest} className={classes}>
        <label>{label}</label>
      </ElementType>
    )
  }

  // ----------------------------------------
  // Checkbox/Radio Control
  // ----------------------------------------
  const controlProps = { ...rest, children, type }

  // wrap HTML checkboxes/radios in the label
  if (control === 'input' && (type === 'checkbox' || type === 'radio')) {
    return (
      <ElementType className={classes}>
        <label>
          {createElement(control, controlProps)} {label}
        </label>
      </ElementType>
    )
  }

  // pass label prop to controls that support it
  if (control === Checkbox || control === Radio) {
    return (
      <ElementType className={classes}>
        {createElement(control, { ...controlProps, label })}
      </ElementType>
    )
  }

  // ----------------------------------------
  // Other Control
  // ----------------------------------------

  // control with a label
  if (control && label) {
    return (
      <ElementType className={classes}>
        <label>{label}</label>
        {createElement(control, controlProps)}
      </ElementType>
    )
  }

  // control without a label
  if (control && !label) {
    return (
      <ElementType className={classes}>
        {createElement(control, controlProps)}
      </ElementType>
    )
  }
}

FormField._meta = {
  name: 'FormField',
  parent: 'Form',
  type: META.TYPES.COLLECTION,
  props: {
    width: SUI.WIDTHS,
    control: [
      'button',
      'input',
      'select',
      'textarea',
    ],
  },
}

FormField.propTypes = {
  /** An element type to render as (string or function). */
  as: customPropTypes.as,

  /**
   * A form control component (i.e. Dropdown) or HTML tagName (i.e. 'input').
   * Extra FormField props are passed to the control component.
   * Mutually exclusive with children.
   */
  control: customPropTypes.some([
    PropTypes.func,
    PropTypes.oneOf(FormField._meta.props.control),
  ]),

  /** Primary content */
  children: PropTypes.node,

  /** Additional classes to add */
  className: PropTypes.string,

  /** Individual fields may be disabled */
  disabled: PropTypes.bool,

  /** Individual fields may display an error state */
  error: PropTypes.bool,

  /** A field can have its label next to instead of above it */
  inline: PropTypes.bool,

  // Heads Up!
  // Do not disallow children with `label` shorthand
  // The `control` might accept a `label` prop and `children`
  /** Mutually exclusive with children. */
  label: PropTypes.string,

  /** A field can show that input is mandatory.  Requires a label. */
  required: customPropTypes.every([
    customPropTypes.demand(['label']),
    PropTypes.bool,
  ]),

  /** Passed to the control component (i.e. <input type='password' />) */
  type: customPropTypes.every([
    customPropTypes.demand(['control']),
    // don't strictly validate HTML types
    // a control might be passed that uses a `type` prop with unknown values
    // let the control validate if for us
  ]),

  /** A field can specify its width in grid columns */
  width: PropTypes.oneOf(FormField._meta.props.width),
}

export default FormField
