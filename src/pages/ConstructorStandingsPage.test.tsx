import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { constructorById, season } from '@/data/season'
import { constructorStandings } from '@/lib/standings'
import { renderAt } from '@/test/render'

const standings = constructorStandings(season.races)
const name = (id: string) => constructorById(id)?.name ?? id

describe('ConstructorStandingsPage', () => {
  it('lists one row per constructor in standings order', () => {
    renderAt('/standings/constructors')
    expect(screen.getByRole('heading', { name: 'Constructor standings' })).toBeInTheDocument()
    const rows = within(screen.getByRole('table')).getAllByRole('row')
    expect(rows).toHaveLength(standings.length + 1)
    expect(within(rows[1]!).getByText(name(standings[0]!.id))).toBeInTheDocument()
    expect(within(rows[2]!).getByText(name(standings[1]!.id))).toBeInTheDocument()
  })

  it("shows the leader's points and wins", () => {
    renderAt('/standings/constructors')
    const leader = standings[0]!
    const cells = within(screen.getAllByRole('row')[1]!).getAllByRole('cell')
    expect(cells[0]).toHaveTextContent('1')
    expect(cells[2]).toHaveTextContent(String(leader.wins))
    expect(cells[3]).toHaveTextContent(String(leader.points))
  })
})
