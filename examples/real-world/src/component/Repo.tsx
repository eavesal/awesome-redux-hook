import React from 'react'
import { Link } from 'react-router-dom'

export interface IRepo {
  name: string
  description?: string
}

export interface IOwner {
  login: string
}

interface IRepoProps {
  repo: IRepo
  owner: IOwner
}

export function Repo({ repo, owner }: IRepoProps) {
  const { login } = owner
  const { name, description } = repo

  return (
    <div className="Repo">
      <h3>
        <Link to={`/${login}/${name}`}>{name}</Link>
        {' by '}
        <Link to={`/${login}`}>{login}</Link>
      </h3>
      {description && <p>{description}</p>}
    </div>
  )
}
