import { KeyValuePair } from 'ramda'
import React from 'react'
import { IOwner, IRepo, Repo } from './Repo'

interface IListProps {
  isFetching: boolean
  nextPageUrl?: string
  loadingLabel: string
  pageCount: number
  items: KeyValuePair<IRepo, IOwner>[]
  onLoadMore(): void
}

export function List({
  isFetching,
  nextPageUrl,
  pageCount,
  items,
  loadingLabel,
  onLoadMore,
}: IListProps) {
  const isEmpty = items.length === 0
  if (isEmpty && isFetching) {
    return (
      <h2>
        <i>{loadingLabel}</i>
      </h2>
    )
  }

  const isLastPage = !nextPageUrl
  if (isEmpty && isLastPage) {
    return (
      <h1>
        <i>Nothing here!</i>
      </h1>
    )
  }

  return (
    <div>
      {items.map(([repo, owner]) => (
        <Repo repo={repo} owner={owner} />
      ))}
      {pageCount > 0 && !isLastPage && (
        <button
          style={{ fontSize: '150%' }}
          onClick={onLoadMore}
          disabled={isFetching}
        >
          {isFetching ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
