import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { driverById, season } from '@/data/season'
import { driverStandings } from '@/lib/standings'
import { renderAt } from '@/test/render'

const standings = driverStandings(season.races)
const name = (id: string) => {
  const d = driverById(id)!
  return `${d.givenName} ${d.familyName}`
}

describe('DriverStandingsPage', () => {
  it('lists one row per driver in standings order', () => {
    renderAt('/standings/drivers')
    expect(screen.getByRole('heading', { name: 'Driver standings' })).toBeInTheDocument()
    const rows = within(screen.getByRole('table')).getAllByRole('row')
    expect(rows).toHaveLength(standings.length + 1)
    expect(within(rows[1]!).getByText(name(standings[0]!.id))).toBeInTheDocument()
    expect(within(rows[2]!).getByText(name(standings[1]!.id))).toBeInTheDocument()
  })

  it("shows the leader's points and wins", () => {
    renderAt('/standings/drivers')
    const leader = standings[0]!
    const row = screen.getByRole('row', { name: new RegExp(name(leader.id)) })
    const cells = within(row).getAllByRole('cell')
    expect(cells[0]).toHaveTextContent('1')
    expect(cells[3]).toHaveTextContent(String(leader.wins))
    expect(cells[4]).toHaveTextContent(String(leader.points))
  })
})
