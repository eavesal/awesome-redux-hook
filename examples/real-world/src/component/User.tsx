import React from 'react'
import { Link } from 'react-router-dom'

export interface IUser {
  login: string
  avatarUrl: string
  name?: string
}

interface IUserProps {
  user: IUser
}

export function User({ user }: IUserProps) {
  const { login, avatarUrl, name } = user
  return (
    <div className="User">
      <Link to={`/${login}`}>
        <img src={avatarUrl} width="72" height="72" />
        <h3>
          {login} {name && <span>({name})</span>}
        </h3>
      </Link>
    </div>
  )
}
