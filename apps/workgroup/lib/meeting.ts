import sql from './db'
import { Meeting } from '@/interfaces'

// /// Change DATE_TIME_FORMAT by the format need
// import * as moment from 'moment'
// const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
// let _now: Moment;
// _now = moment(new Date(), DATE_TIME_FORMAT);

export async function list() {
  return await sql<Meeting[]>`
    SELECT id, name, text, config, updated_at FROM meeting
    ORDER BY updated_at
  `
}

export async function create(meeting: Meeting) {
  try {
    await sql<Meeting[]>`
    INSERT INTO meeting (name, text, config) VALUES(${meeting.name}, ${meeting.text}, ${meeting.config})
    RETURNING id, name, text, config, updated_at
  `
    return { message: `Added meeting ${meeting.name}` }
  } catch (e) {
    return { message: 'Failed to create meeting' }
  }
}

export async function update(meeting: Meeting) {
  return await sql<Meeting[]>`
    UPDATE meeting SET updated_at=NOW() WHERE id=${meeting.id}
    RETURNING id, name, text, config, updated_at
  `
}

export async function remove(meeting: Meeting) {
  return await sql<Meeting[]>`
    DELETE FROM meeting WHERE id=${meeting.id}
    RETURNING id
  `
}
