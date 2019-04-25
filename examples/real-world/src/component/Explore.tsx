import Col from 'antd/lib/col'
import Search from 'antd/lib/input/Search'
import Row from 'antd/lib/row'
import React from 'react'

const GITHUB_REPO = 'https://github.com/reduxjs/redux'

interface IExploreProps {
  defaultValue?: string
  onSubmit?(value: string): void
}

export function Explore({ defaultValue, onSubmit }: IExploreProps) {
  return (
    <>
      <p>Type a username or repo full name and hit 'Go':</p>
      <Row gutter={8}>
        <Col span={16}>
          <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            defaultValue={defaultValue}
            onSearch={onSubmit}
          />
        </Col>
        <Col span={8}>
          Code on{' '}
          <a href={GITHUB_REPO} target="_blank">
            Github
          </a>
        </Col>
      </Row>
    </>
  )
}
