const db = require('../config/db');

const saveCycle = async (userId, lastPeriodDate, cycleLength, nextPeriod, ovulationDate, fertileStart, fertileEnd) => {
    const result = await db.query(
        `INSERT INTO ovulation_cycles 
    (user_id, last_period_date, average_cycle_length, next_period_date, ovulation_date, fertile_window_start, fertile_window_end) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [userId, lastPeriodDate, cycleLength, nextPeriod, ovulationDate, fertileStart, fertileEnd]
    );
    return result.rows[0].id;
};

const getCyclesByUser = async (userId) => {
    const { rows } = await db.query('SELECT * FROM ovulation_cycles WHERE user_id = $1 ORDER BY created_at DESC LIMIT 6', [userId]);
    return rows;
};

module.exports = {
    saveCycle,
    getCyclesByUser
};
