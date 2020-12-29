const db = require('./db');

const args    = process.argv.slice(2)
const trxType = args[0]
const account = args[1]
const date    = args[2]
const desc    = args[3]
const amount  = args[4]

// node index.js <trxType> <account> <date> <desc> <amount>

switch(trxType) {
  case 'nueva':
    newTrx(account, date, desc, amount)
    break;
  case 'consulta':
    showTrxs(account)
    break;
  case 'consulta-saldo': 
    showBalance(account)
    break;
} 

async function showTrxs(account){
  const client = await db.getClient()
  const cursor = new db.Cursor(`SELECT * FROM trxs where accountId = ${account}`)
  client.query(cursor);
  cursor.read(10, (err, rows)=>{
    if (err) console.log(err);
    console.log(`Las últimas 10 trxs de la cuenta ${account} son: `, rows);
    client.release()
    db.end()
   })
  }

async function showBalance(account){
  const client = await db.getClient()
  const cursor = new db.Cursor(`SELECT * FROM accounts where id = ${account}`)
  client.query(cursor);
  cursor.read(10, (err, rows)=>{
    if (err) console.log(err);
    console.log(`El saldo de la cuenta ${account} es: `, rows[0].balance);
    client.release()
    db.end()
   })
  }

  async function newTrx(account, date, desc, amount){
    const client = await db.getClient()
    const updateBalanceQry = { 
        text: `UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING *`,
        values: [amount, account]
      };
    const newTrx = { 
      text: "INSERT INTO trxs (description, date, amount, accountId) values ($1, $2, $3, $4) RETURNING *", 
      values: [desc, date, amount, account] 
      };
    try { 
      await client.query("BEGIN") 
      const result = await client.query(newTrx) 
      await client.query(updateBalanceQry)
      await client.query("COMMIT") 
      console.log("Transacción realizada con éxito")
      console.log("Ultima transacción: ", result.rows[0]) 
    } catch (e) { 
      await client.query("ROLLBACK")
      console.log(e) 
    }
    client.release()
    db.end()
  }
