import React from 'react'
import PropTypes from 'prop-types'

export default function TemplatePage({ title }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <div className="text-sm text-gray-500">Today • {new Date().toLocaleDateString()}</div>
      </div>

      
    </div>
  )
}

TemplatePage.propTypes = { title: PropTypes.string }
TemplatePage.defaultProps = { title: 'Page Title' }
