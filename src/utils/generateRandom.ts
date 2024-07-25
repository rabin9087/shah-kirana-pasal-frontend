export const generateRandomCode = () => {
    
  const len = Math.floor((Math.random() * (8 -3)) + 3)
  let str =""
    for (let i = 0; i < len; i++) {
      str += Math.floor(Math.random() * 10)
    }
    return str
}

export const generateRandomBarcode = () => {
    
  const len = Math.floor((Math.random() * (15 - 8)) + 8)
  let str =""
    for (let i = 0; i < len; i++) {
      str += Math.floor(Math.random() * 10)
    }
    return str
}