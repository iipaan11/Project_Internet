const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const port = 8000;
// สำหรับเก็บ logistic
let logistics = []
let counter = 1;
let conn = null;

const initMySQL =  async () =>{
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8700
})
}


const validateData = (logisticData) => {
  let errors = []
  if (!logisticData.productid){
    errors.push('กรุณากรอกรหัสสินค้า')
  }
  if (!logisticData.origindestination){
      errors.push('กรุณากรอกสถานที่ต้นทาง-ปลายทาง')
  }

  if (!logisticData.deliverystatus){
      errors.push('กรุณาเลือกสถานะการจัดส่ง')
  }

  if (!logisticData.warehousespace){
      errors.push('กรุณากรอกพื้นที่ในคลัง')
  }

  if (!logisticData.storagemethod){
      errors.push('กรุณากรอกการจัดเก็บสินค้า')
  }

  if (!logisticData.spacearrangement){
      errors.push('กรุณากรอกการจัดเรียงพื้นที่')
  }

  if (!logisticData.deliverytime){
      errors.push('กรุณากรอกการส่งถึงเวลา')
  }

  if (!logisticData.transportissues){
    errors.push('กรุณากรอกปัญหาการขนส่ง')
  }

  if (!logisticData.deliveryefficiency){
    errors.push('กรุณาเลือกประสิทธิภาพการจัดส่ง')
  }

  return errors
}


 // path = GET /logistics สำหรับ get logistics ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/logistics', async (req, res) => {
  const results = await conn.query('SELECT * FROM logistics')
  res.json(results[0])
})

// path = POST /logistics สำหรับการสร้าง logistics ใหม่บันทึกเข้าไป
app.post('/logistics', async (req, res) => {
  try{
  let logistic = req.body;

  const errors = validateData(logistic)
  if(errors.length > 0 ){
    
    throw{
      message:'กรอกข้อมูลไม่ครบ',
      errors: errors
    }
  }
  const results = await conn.query('INSERT INTO logistics SET ?',logistic)
  res.json({
    message:'Create new logistic successfully',
    data:results[0]
  })
  } catch (error) {
    const errorsMessage = error.errors || 'something went wrong'
    const errors = error.errors || []
    console.log('errorMessage',error.message)
    res.status(500).json({
      message: errorsMessage,
      errors: errors
    })
  }
})

// path = GET /logistics/:id สำหรับการดึง logistics รายคนออกมา
app.get('/logistics/:id', async (req, res) => {
  try{
  let id = req.params.id
  const results = await conn.query('SELECT * FROM logistics WHERE id = ?', id)

  if(results[0].length == 0){
    throw{statusCode: 404, message:'logistic not found'}
  }
  res.json(results[0][0])
  }catch(error){
    console.log('errorMessage',error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
    message:'something went wrong',
    errorMessage: error.message
  })
  }
})


//path = PUT /logistics/:productid สำหรับการแก้ไข logistics รายคน (ตาม productid ที่บันทึกเข้าไป)
app.put('/logistics/:id', async (req, res) => {

  try{
    let id = req.params.id;
    let updateLogistic = req.body;
    const results = await conn.query(
      'UPDATE logistics SET ? WHERE id = ?',
      [updateLogistic, id]
      )
    res.json({
      message:'Update logistic successfully',
      data:results[0]
    })
    } catch (error) {
      console.log('errorMessage',error.message)
      res.status(500).json({
        message:'something went wrong'
      })
    }
})

// path = DELETE /logistic/:productid สำหรับการลบ logistics รายคน (ตาม productid ที่บันทึกเข้าไป)
app.delete('/logistics/:id', async(req, res) => {
  try{
    let id = req.params.id;
    const results = await conn.query('DELETE FROM logistics WHERE id = ?',id)
      res.json({
      message: 'Delete logistic successfully',
      data:results[0]
  })
    } catch (error) {
      console.log('errorMessage',error.message)
      res.status(500).json({
        message:'something went wrong'
      })
    }
})

app.listen(port, async(req, res) => {
  await initMySQL();
    console.log('http server running on', + port);
})