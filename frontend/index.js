const BASE_URL = 'http://localhost:8000'

let mode = 'CREATE'
let selectedId = ''

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  console.log('id', id)
  if (id) {
    mode = 'EDIT'
    selectedId = id

    try {
      const response = await axios.get(`${BASE_URL}/logistics/${id}`)
      const logistic = response.data

      let productidDOM = document.querySelector('input[name=productid]')
      let origindestinationDOM = document.querySelector('input[name=origindestination]')
      let warehousespaceDOM = document.querySelector('input[name=warehousespace]')
      let storagemethodDOM = document.querySelector('input[name=storagemethod]')
      let spacearrangementDOM = document.querySelector('input[name=spacearrangement]')
      let deliverytimeDOM = document.querySelector('input[name=deliverytime]')
      let transportissuesDOM = document.querySelector('input[name=transportissues]')

      productidDOM.value = logistic.productid
      origindestinationDOM.value = logistic.origindestination
      warehousespaceDOM.value = logistic.warehousespace
      storagemethodDOM.value = logistic.storagemethod
      spacearrangementDOM.value = logistic.spacearrangement
      deliverytimeDOM.value = logistic.deliverytime
      transportissuesDOM.value = logistic.transportissues

      let deliverystatusDOMs = document.querySelectorAll('input[name=deliverystatus]')
      let deliveryefficiencyDOMs = document.querySelectorAll('input[name=deliveryefficiency]')

      for (let i = 0; i < deliverystatusDOMs.length; i++) {
        if (deliverystatusDOMs[i].value == logistic.deliverystatus) {
          deliverystatusDOMs[i].checked = true
        }
      }

      for (let i = 0; i < deliveryefficiencyDOMs.length; i++) {
        if (deliveryefficiencyDOMs[i].value == logistic.deliveryefficiency) {
          deliveryefficiencyDOMs[i].checked = true
        }
      }

    } catch (error) {
      console.log('error', error)
    }
  }
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
  
  
  const submitData = async () => {
    let productidDOM = document.querySelector('input[name=productid]')
    let origindestinationDOM = document.querySelector('input[name=origindestination]')
    let deliverystatusDOM = document.querySelector('input[name=deliverystatus]:checked') || {}
    let warehousespaceDOM = document.querySelector('input[name=warehousespace]')
    let storagemethodDOM = document.querySelector('input[name=storagemethod]')
    let spacearrangementDOM = document.querySelector('input[name=spacearrangement]')
    let deliverytimeDOM = document.querySelector('input[name=deliverytime]')
    let transportissuesDOM = document.querySelector('input[name=transportissues]')
    let deliveryefficiencyDOM = document.querySelector('input[name=deliveryefficiency]:checked') || {}

    let messageDOM = document.getElementById('message')

    try {
      let logisticData = {
        productid: productidDOM.value,
        origindestination: origindestinationDOM.value,
        deliverystatus: deliverystatusDOM.value,
        warehousespace: warehousespaceDOM.value,
        storagemethod: storagemethodDOM.value,
        spacearrangement: spacearrangementDOM.value,
        deliverytime: deliverytimeDOM.value,
        transportissues: transportissuesDOM.value,
        deliveryefficiency: deliveryefficiencyDOM.value
      }
      console.log('submit data', logisticData)

      const errors = validateData(logisticData)

      if (errors.length > 0) {
        throw {
          message: 'กรอกข้อมูลไม่ครบ!',
          errors: errors
        }
      }

      let message = 'บันทึกข้อมูลสำเร็จ!'

      if(mode == 'CREATE'){
        const response = await axios.post(`${BASE_URL}/logistics`, logisticData)
        console.log('response', response.data)
      } else {
        const response = await axios.put(`${BASE_URL}/logistics/${selectedId}`, logisticData)
        message = 'แก้ไขข้อมูลสำเร็จ!'
        console.log('response', response.data)
      }
      messageDOM.innerText = message
      messageDOM.className = 'message success'

    } catch (error) {
      console.log('error message', error.message)
      console.log('error', error.errors)
      if (error.response) {
        console.log(error.response)
        error.message = error.response.data.message
        error.errors = error.response.data.errors
      }

      let htmlData = '<div>'
      htmlData += `<div>${error.message}</div>`
      htmlData += '<ul>'
      for (let i = 0; i < error.errors.length; i++) {
        htmlData += `<li>${error.errors[i]}</li>`
      }
      htmlData += '</ul>'
      htmlData += '</div>'


      messageDOM.innerHTML = htmlData
      messageDOM.className = 'message danger'
    }
  }