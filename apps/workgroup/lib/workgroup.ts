import sql from './db'
import { Workgroup } from '@/interfaces'

// /// Change DATE_TIME_FORMAT by the format need
// import * as moment from 'moment'
// const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
// let _now: Moment;
// _now = moment(new Date(), DATE_TIME_FORMAT);

export async function list() {
  return await sql<Workgroup[]>`
    SELECT id, name, text, config, updated_at FROM workgroup
    ORDER BY updated_at
  `
}

export async function create(workgroup: Workgroup) {
  try {
    await sql<Workgroup[]>`
    INSERT INTO workgroup (name, text, config) VALUES(${workgroup.name}, ${workgroup.text}, ${workgroup.config})
    RETURNING id, name, text, config, updated_at
  `
    return { message: `Added workgroup ${workgroup.name}` }
  } catch (e) {
    return { message: 'Failed to create workgroup' }
  }
}

export async function update(workgroup: Workgroup) {
  return await sql<Workgroup[]>`
    UPDATE workgroup SET updated_at=NOW() WHERE id=${workgroup.id}
    RETURNING id, name, text, config, updated_at
  `
}

export async function remove(workgroup: Workgroup) {
  return await sql<Workgroup[]>`
    DELETE FROM workgroup WHERE id=${workgroup.id}
    RETURNING id
  `
}
