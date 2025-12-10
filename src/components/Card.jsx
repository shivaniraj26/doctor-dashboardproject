import React from 'react'
import PropTypes from 'prop-types'

export default function Card({ children }) {
  return (
    <div className="bg-white p-4 rounded-2xl card-shadow border border-gray-100">
      {children}
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node,
}
Card.defaultProps = {
  children: null,
}
