import { Objects_collection_LS } from '../App'
import {
  LittleEndian,
  hexToDec,
  hex_to_ascii,
  hex2Fixed,
  UnitsConvertor,
  decToHex,
  hex2bin,
  bin2hex
} from './NumberConversion'
import { FG_DisplayVSApplied_1, FG_OptionsObject_1 } from '../scenes/global/topbar'
import {
  Mapping_objects_array,
  FG_Objects_Array,
  EMCYcodes,
  SDO_abortCodes,
  Mapping_objects_array_basedOnType,
  ObjectDescriptions
} from '../data/SmallData'
import { Registers_CANopen_LS } from '../App'

export function whatFG_isObject(obj) {
  obj = obj.toUpperCase()

  if (obj.slice(0, 2) == '#X') {
    obj = obj.slice(2, obj.length)
  }
  // If object is '6060_00', remove '_00'
  if (obj.length > 4 && obj.slice(4, 7) === '_00') {
    obj = obj.slice(0, 4)
  }

  for (const type in FG_Objects_Array) {
    if (FG_Objects_Array[type] && FG_Objects_Array[type].includes(obj)) {
      return type
    }
  }

  return false
}

export var ObjectValuesSaved_global = {
  '208E': [],
  '60C0': [],
  '60C1_01': [],
  6060: [],
  '2064_address': [], //deciml
  '2064_memoryType': [],
  '2064_addrInc': [],
  '2064_addrSize': [],
  2069: []
}

export function whatObjectValueMeans(obj, value, objectSize, type, axisID, CS) {
  //SDO with read CS='40' dont come here
  obj = obj.toUpperCase()
  if (obj.slice(0, 2) == '#X' || obj.slice(0, 2) == '0X') {
    obj = obj.slice(2, obj.length)
  }
  // If object is '6060_00', remove '_00'
  if (obj.length > 4 && obj.slice(4, 7) === '_00') {
    obj = obj.slice(0, 4)
  }
  var type_Transmit_Receive
  if (type == 'R_SDO' || type.slice(0, 4) == 'RPDO') {
    type_Transmit_Receive = 'R'
  } else {
    type_Transmit_Receive = 'T'
  }

  function get_CW_SW_info(obj, value) {
    // Provide info for 6040 and 6041
    var Interpretation = '-'
    var decValue = hexToDec(value, 32)
    if (obj == '6041') {
      if (decValue & 0x4) Interpretation = 'OpEn'
      else if (decValue & 0x2) Interpretation = 'SwOn'
      else if (decValue & 0x1) Interpretation = 'RSwOn'
      else if (decValue & 0x40) Interpretation = 'SwOnDis'
      //Errors:
      if (decValue & 0x40 && decValue & 0x7)
        Interpretation = 'Error: bit6 and one of the bits 0-2 is set together'
      if (decValue & 0x43 && decValue & 0x8000 && !decValue & 0x4)
        Interpretation = 'Error: bit6-1-0 and Axison set'

      if (decValue & 0x8000) Interpretation = Interpretation + ' + Axison'
      if (decValue & 0x0400) Interpretation = Interpretation + ' + TR'
      if (!decValue & 0x20) Interpretation = Interpretation + ' + QS'

      if (decValue & 0x8) Interpretation = 'FAULT'
    } else {
      //6040
      if ((decValue & 0xf) == 0xf) Interpretation = 'OpEn'
      if ((decValue & 0x1f) == 0x1f) Interpretation = 'UPD'
      if (decValue & 0x80) Interpretation = 'Reset Fault'
      if (!decValue & 0x40) Interpretation = 'QuickStop'
      if (decValue & 0x100) Interpretation = 'HALT'
    }
    return Interpretation
  }

  //Modify 6040 -> 60401 to have the correct register when displaying in the table
  if (obj == '6040' || obj == '6041') {
    if (ObjectValuesSaved_global['6060'][axisID]) {
      //We change somthing only if there is a global value for this axis ModesOfOperation

      var aux_value = obj.concat(ObjectValuesSaved_global['6060'][axisID])
      const filterOptions = Registers_CANopen_LS.filter(
        (oneRegister) => oneRegister.Index == aux_value
      )
      if (filterOptions.length > 0) {
        //Register Exists
        return [
          ObjectValuesSaved_global['6060'][axisID],
          'neutral',
          'adjust_StatusWord_or_ControlWord',
          get_CW_SW_info(obj, value)
        ]
      }
    }
  }

  var TextReturn = false
  var msgType = 'random'
  var whatModifications = 'SomethingFound'

  switch (obj) {
    case '6060':
      //Modes of Operation
      if (type_Transmit_Receive == 'R') {
        if (value.length == 2 && value[0] == '0') {
          // Change value 01 into 1
          value = value.slice(1)
        }

        ObjectValuesSaved_global['6060'][axisID] = value
      }
      if (CS != '40') {
        var decValue = hexToDec(value, 8)

        TextReturn = ObjectDescriptions['6060'][decValue]
        msgType = 'blue'
        whatModifications = 'whatValueMeansInObj'
      }
      break
    case '6041':
      TextReturn = get_CW_SW_info('6041', value)
      break
    case '6040':
      TextReturn = get_CW_SW_info('6040', value)
      break
    case '1000':
      //Device Type
      if (type_Transmit_Receive == 'T') {
        if (value == '00060192') TextReturn = `60192h for iPOS family`
      }
      break
    case '1002':
      //SW+ SRH
      if (type_Transmit_Receive == 'T') {
        var Interpretation = '-'
        var decValue = hexToDec(value, 32)
        if (decValue & 0x4) Interpretation = 'OpEn'
        else if (decValue & 0x2) Interpretation = 'SwOn'
        else if (decValue & 0x1) Interpretation = 'RSwOn'
        else if (decValue & 0x40) Interpretation = 'SwOnDis'
        //Errors:
        if (decValue & 0x40 && decValue & 0x7)
          Interpretation = 'Error: bit6 and one of the bits 0-2 is set together'
        if (decValue & 0x43 && decValue & 0x8000 && !decValue & 0x4)
          Interpretation = 'Error: bit6-1-0 and Axison set'

        if (decValue & 0x8000) Interpretation = Interpretation + ' + Axison'
        if (decValue & 0x0400) Interpretation = Interpretation + ' + TR'
        if (!decValue & 0x20) Interpretation = Interpretation + ' + QS'
        if (decValue & 0x200000) Interpretation = Interpretation + ' + Autorun'

        if (decValue & 0x8) Interpretation = 'FAULT'
        if (decValue & 0x80000000) Interpretation += '+ Fault_bit31'
        if (decValue & 0x400000) Interpretation += ' +LSP'
        if (decValue & 0x800000) Interpretation += ' +LSN'
        TextReturn = Interpretation
      }
      break

    case '1013':
      //Serial Number
      if (type == 'T_SDO') {
        TextReturn = `${hexToDec(value, 64)} us`
      }
      break

    case '1018_04':
      //Serial Number
      if (type == 'T_SDO') {
        var temp = value.slice(0, 4)
        TextReturn = `${hex_to_ascii(temp)}${value.slice(4, 8)}`
      }
      break
    case '1018_02':
      //ProductID
      if (type == 'T_SDO') {
        var temp = hexToDec(value, 32).toString()
        TextReturn = `P0${temp.slice(0, 2)}.${temp.slice(2, 5)}.${temp.slice(5)}`
      }
      break
    case '1018_03':
      //ProductID
      if (type == 'T_SDO') {
        TextReturn = hex_to_ascii(value).toString()
      }
      break
    case '2060':
      //ProductID
      if (type == 'T_SDO') {
        TextReturn = hex_to_ascii(LittleEndian(value)).toString()
      }
      break
    case '6077':
      //Torque(Current) actual value
      if (type == 'T_SDO' || type.slice(0, 4) == 'TPDO') {
        var temp = hexToDec(value, 16).toString()
        TextReturn = `${temp} IU or ${temp / 10}%`
      }
      break
    case '207B':
    case '6071':
    case '207E':
      var temp = hexToDec(value, 16).toString()
      TextReturn = `${temp} IU or ${temp / 10}%`
      break
    case '208E':
      if (type_Transmit_Receive == 'R') {
        ObjectValuesSaved_global['208E'][axisID] = value
        TextReturn = `Write #208E <- ${value}`
      }
      break
    case '2073':
      TextReturn = `Buffer length: ${hexToDec(value, 16)}`

      break
    case '60C0':
      var temp = parseInt(hexToDec(value, objectSize))
      ObjectValuesSaved_global['60C0'][axisID] = temp
      if (temp == 0) {
        TextReturn = 'Linear Interpolation or PT (Position –Time) '
      } else if (temp == -1) {
        TextReturn = 'PVT (Position – Velocity – Time) cubic interpolation'
      } else {
      }
      msgType = 'blue'
      whatModifications = 'whatValueMeansInObj'
      break

    case '60C1_01':
      var bit8_208E = hex2bin(ObjectValuesSaved_global['208E'][axisID], 16).slice(7, 8)
      if (bit8_208E == 0 && ObjectValuesSaved_global['60C0'][axisID] == 0) {
        //We have PT interpolation
        TextReturn = `Pos: ${hexToDec(value, objectSize)} IU`
      } else if (bit8_208E == 0 && ObjectValuesSaved_global['60C0'][axisID] == -1) {
        //PVT
        let pos = value.slice(0, 2) + value.slice(4) // Bug : TPOS needs to be 32 bits, something is missing
        let temp = hexToDec(pos, 32)
        if (temp > 8388607) {
          //temp bigger than 7F FFFF
          pos = 'FF'.concat(pos)
        }
        let spd_fractional = value.slice(2, 4)
        TextReturn = `Pos: ${hexToDec(pos, 32)} IU`
        ObjectValuesSaved_global['60C1_01'][axisID] = spd_fractional
      }
      break
    case '60C1_02':
      var bit8_208E = hex2bin(ObjectValuesSaved_global['208E'][axisID], 16).slice(7, 8)
      if (bit8_208E == 0 && ObjectValuesSaved_global['60C0'][axisID] == 0) {
        //We have PT interpolation
        var time = hexToDec(value.slice(4, 8), 16)
        var counter = hexToDec(bin2hex(hex2bin(value.slice(0, 4), 16).slice(0, 7)), 16)
        TextReturn = `Time: ${time}, Counter: ${counter}`
      } else if (bit8_208E == 0 && ObjectValuesSaved_global['60C0'][axisID] == -1) {
        //PVT
        let counter = hexToDec(bin2hex(hex2bin(value.slice(0, 4), 16).slice(0, 7)), 16)
        let time = hexToDec(bin2hex(hex2bin(value.slice(0, 4), 16).slice(7)), 16)
        let spd = hex2Fixed(
          value.slice(4, 8).concat(ObjectValuesSaved_global['60C1_01'][axisID], '00')
        )
        TextReturn = `Speed: ${spd} IU, Time: ${time} IU, Counter: ${counter}`
      }
      break
    case '1003':
      TextReturn = `You can read ${parseInt(value)} errors`
      break
    case '1003_01':
    case '1003_02':
    case '1003_03':
    case '1003_04':
    case '1003_05':
      TextReturn = DecodeEMCY(LittleEndian(value))[4]
      break

    case '1010_01':
      if (value == '65766173') {
        TextReturn = 'SAVE certain parameters to EEPROM'
      } else {
        TextReturn = 'Wrong value, it needs to be 65766173 to save to eeprom'
      }
      break
    case '1011_01':
      if (value == '64616F6C') {
        TextReturn = 'LOAD certain parameters from EEPROM'
      } else {
        TextReturn = 'Wrong value, it needs to be 64616F6C to LOAD from eeprom'
      }
      break
    case '1006':
      TextReturn = `${parseInt(hexToDec(value, 32)) / 1000}ms`
      break
    case '1005':
      if (hex2bin(value, 32).slice(1, 2) == '1') {
        TextReturn = ` SYNC producer activated`
      }
      break

    case '2089':
      if (hex2bin(value, 16).slice(14, 15) == '1') {
        TextReturn = `View SYNC0 on Error/OUT2`
      } else if (hex2bin(value, 16).slice(13, 14) == '1') {
        TextReturn = `Trigger Control Loop (slow loop) on Ready/OUT3`
      }
      break
    case '2001':
      TextReturn = `MER mask, choose which of the errors will be sent as EMCY`
      break
    case '2102':
      TextReturn = `Brake status, 0 or 1`
      break
    case '2046':
    case '2047':
    case '2055':
    case '2058':
    case '2053':
    case '2054':
    case '207F':
    case '2083':
    case '2084':
    case '2027':
    case '2103':
    case '2092_1':
    case '2092_2':
    case '2092_3':
    case '2092_4':
    case '6091_01':
    case '6091_02':
    case '6092_01':
    case '6092_02':
    case '208D':
    case '6075':
    case '6087':
    case '606D':
    case '2013_02':
    case '201B':
      TextReturn = hexToDec(value, 32)
      break
    case '2108_01':
    case '2108_02':
    case '2052':
    case '2025':
    case '2026':
    case '208B':
    case '208C':
    case '2100':
    case '2101':
    case '60C2_01':
    case '2013_01':
      TextReturn = hexToDec(value, 16)
      break
    case '60C2_02':
      TextReturn = hexToDec(value, 8)
      break
    case '201A':
      TextReturn = `Cam table run address : 0x${value}`
      break
    case '2108_01':
      TextReturn = `Address of the variable which will be filtered: ${value}`
      break
    case '2086':
      TextReturn = `Any value besides 0 will limit the speed in CSP`
      break
    case '206B':
    case '206C':
      TextReturn = hex2Fixed(value)
      break
    case '2006':
      var temp = hexToDec(value, 16)
      if (temp > 0 && temp < 10) {
        TextReturn = `Call TML ${temp} function`
      } else {
        TextReturn = `invalid value`
      }
      break
    case '2077':
      TextReturn = 'Execute TML code'
      break

    case '2064':
      var startAddress = value.slice(0, 4)
      var bits = hex2bin(value.slice(4, 8), 16)
      var bit0_16_32bitsData = bits.slice(15)
      var bits_3_2_MemoryType = bits.slice(12, 14)
      var bits_7_AutoIncrement = bits.slice(8, 9)
      if (bits_3_2_MemoryType == '10') {
        bits_3_2_MemoryType = 'EEPROM memory'
      } else if (bits_3_2_MemoryType == '01') {
        bits_3_2_MemoryType = 'Data memory'
      } else if (bits_3_2_MemoryType == '00') {
        bits_3_2_MemoryType = 'Program memory'
      } else {
        bits_3_2_MemoryType = 'Invalid memory'
      }
      if (bits_7_AutoIncrement == '1') {
        bits_7_AutoIncrement = 0
      } else {
        if (bit0_16_32bitsData == '0') {
          bits_7_AutoIncrement = 1
        } else {
          //read/write in two cells
          bits_7_AutoIncrement = 2
        }
      }

      if (bit0_16_32bitsData == '0') {
        bit0_16_32bitsData = '16bits data'
      } else {
        bit0_16_32bitsData = '32bits data'
      }
      ObjectValuesSaved_global['2064_address'][axisID] = hexToDec(startAddress, 16)
      ObjectValuesSaved_global['2064_memoryType'][axisID] = bits_3_2_MemoryType
      ObjectValuesSaved_global['2064_addrInc'][axisID] = bits_7_AutoIncrement
      ObjectValuesSaved_global['2064_addrSize'][axisID] = bit0_16_32bitsData
      TextReturn = `StartAddress: ${startAddress}, ${bit0_16_32bitsData}, ${bits_3_2_MemoryType}, AutoIncrement: ${bits_7_AutoIncrement}`
      break
    case '2065':
      var valueToWrite
      var addrSize = ObjectValuesSaved_global['2064_addrSize'][axisID]
      if (addrSize) {
        var address = ObjectValuesSaved_global['2064_address'][axisID]
        var memType = ObjectValuesSaved_global['2064_memoryType'][axisID]

        if (addrSize == '16bits data') {
          valueToWrite = value.slice(4, 8)
          TextReturn = `Write,  0x${decToHex(address, 16)}h <- ${valueToWrite}h , ${memType} `
        } else {
          valueToWrite = value
          TextReturn = `Write,  0x${decToHex(address, 16)}h <- ${valueToWrite.slice(
            4,
            8
          )}h , 0x${decToHex(address + 1, 16)}h <- ${valueToWrite.slice(0, 4)}h , ${memType} `
        }

        ObjectValuesSaved_global['2064_address'][axisID] +=
          ObjectValuesSaved_global['2064_addrInc'][axisID]
      } else {
        TextReturn = `There is no recorded instance of object 0x2064h`
      }
      break
    case '2066':
      var valueToWrite
      var addrSize = ObjectValuesSaved_global['2064_addrSize'][axisID]
      if (addrSize) {
        var address = ObjectValuesSaved_global['2064_address'][axisID]
        var memType = ObjectValuesSaved_global['2064_memoryType'][axisID]

        if (addrSize == '16bits data') {
          valueToWrite = value.slice(4, 8)
          TextReturn = `Read,  0x${decToHex(address, 16)}h -> ${valueToWrite}h , ${memType} `
        } else {
          valueToWrite = value
          TextReturn = `Read,  0x${decToHex(address, 16)}h -> ${valueToWrite.slice(
            4,
            8
          )}h , 0x${decToHex(address + 1, 16)}h -> ${valueToWrite.slice(0, 4)}h , ${memType} `
        }

        ObjectValuesSaved_global['2064_address'][axisID] +=
          ObjectValuesSaved_global['2064_addrInc'][axisID]
      } else {
        TextReturn = `There is no recorded instance of object 0x2064h`
      }
      break

    case '2067':
      var memType = ObjectValuesSaved_global['2064_memoryType'][axisID]
      if (memType) {
        value = LittleEndian(value)
        var value2write = LittleEndian(value.slice(0, 4))
        var addy = LittleEndian(value.slice(4, 8))

        TextReturn = `Write,  0x${addy}h <- ${value2write}h , ${memType} `
      } else {
        TextReturn = `There is no recorded instance of object 0x2064h`
      }
      break
    case '2069':
      value = LittleEndian(value)
      var startAddy = LittleEndian(value.slice(0, 4))
      var endAddy = LittleEndian(value.slice(4, 8))

      TextReturn = `Checksum, start: 0x${startAddy}h, end: 0x${endAddy}h`
      ObjectValuesSaved_global['2064_memoryType'][
        axisID
      ] = `Memory range : 0x${startAddy}h - 0x${endAddy}h`
      break
    case '206A':
      var range = ObjectValuesSaved_global['2064_memoryType'][axisID]
      if (range) {
        TextReturn = `${range}, checksum = ${value}`
      }
      break
    case '60F2':
      var bitValue = hex2bin(value, 16).slice(8, 10)
      switch (bitValue) {
        case '00':
          TextReturn = `Normal positioning similar to linear axis; If reaching or exceeding the Position range 
        limits (607Bh) the input value shall wrap automatically to the other end of the range. 
        Positioning can be relative or absolute.
        Only with this bit combination, the movement greater than a modulo value is possible.
        `
          break
        case '01':
          TextReturn = `Positioning only in negative direction; if target position is higher than actual position, 
            axis moves over the min position limit (607Bh, sub-index 01h) to the target position`
          break
        case '10':
          TextReturn = `Positioning only in positive direction; if target position is lower than actual position, axis 
                moves over the max position limit (607Bh, sub-index 02h) to the target position.`
          break
        case '11':
          TextReturn = `Positioning with the shortest way to the target position.
                    NOTE: If the difference between actual value and target position in a 360° system is 
                    180°, the axis moves in positive direction.`
          break
      }
      break
    case '2019':
      TextReturn = `Cam table load address : 0x${value}`
      break

    case '2010':
      var valueDec = hexToDec(value, 32)
      var axixIDSlave = valueDec & 0xff
      var temp = []
      if (valueDec & 0x100) {
        for (let i = 0; i < 8; i++) {
          if (axixIDSlave & (1 << i)) {
            temp.push(`G${i + 1}`)
          }
        }
        axixIDSlave = temp.join(',')
      }
      var masterSendsHisPosition =
        valueDec & 0x8000 ? 'Master is sending his position' : 'Master is inactive'
      TextReturn = `Slave AxisID: ${axixIDSlave} -- ${masterSendsHisPosition}`
      break

    default:
      //Search for the object in a list and tell what the value correspods to x6060=01 = Position Profile
      for (const type in ObjectDescriptions) {
        if (ObjectDescriptions[type] && type == obj) {
          var decValue = hexToDec(value, objectSize)

          for (const description in ObjectDescriptions[type]) {
            if (parseInt(description) == parseInt(decValue)) {
              return [ObjectDescriptions[type][description], 'blue', 'whatValueMeansInObj']
            }
          }
        }
      }
      TextReturn = false
      msgType = false
      whatModifications = false

      break
  }

  return [TextReturn, msgType, whatModifications]

  //[ObjectDescription or GlobalMoO, errorStatus, type between ObjDesc or 604X value]
  return [false, false, false]
}
export function GetObject(index) {
  //Input: 1013 or 1013_05
  //Output: Index, IndexName, IndexBitSize
  index = index.toUpperCase()
  if (index.slice(0, 2) == '#X' || index.slice(0, 2) == '0X') {
    index = index.slice(2, index.length)
  }
  var subIndex = ''
  if (index.length > 4) {
    subIndex = index.slice(4, 7)
    index = index.slice(0, 4)
  } else if (index.length < 4) {
    if (index == '--') {
      return [`${index}`, 'Left Empty', 0]
    }
    return [`${index}`, 'Nothing Found', 0]
  }
  var SearchResult = Objects_collection_LS.filter((object) =>
    object.Index.toUpperCase().match(index)
  )

  if (subIndex || (SearchResult[0] && ![8, 16, 32].includes(SearchResult[0].BitSize))) {
    var aux_Obj = index.concat(subIndex)
    if (SearchResult[0] && SearchResult[0].Info && SearchResult[0].Info.SubItem) {
      SearchResult = SearchResult[0].Info.SubItem.filter((object) =>
        object.Index.toUpperCase().match(aux_Obj)
      )
    } else if (subIndex != '_00') {
      return [`${index.concat(subIndex)}`, 'Nothing Found', 0]
    }
  }
  if (SearchResult[0]) {
    if (!SearchResult[0].Index || !SearchResult[0].Name || !SearchResult[0].BitSize) {
      return ['DataBase Error. Go to', ' EditMenu And Correct this Index', 0]
    }
    return [SearchResult[0].Index, SearchResult[0].Name, SearchResult[0].BitSize]
  } else {
    return [`${index.concat(subIndex)}`, 'Nothing Found', 0]
  }
}

// ********************** //SDO FUNCTIONS// ********************************

export function DecodeSDO(sdoType, message, axisID) {
  // Message will always be less or equal than 16 characters
  if (message.length < 8) {
    //ERROR: SDO insufficient
    return ['-', '-', '-', '-', 'SDO_Error: SDO message length insufficient ', 'error']
  }
  var interpretationInfo = ''
  var errorStatus = ''

  var CS = message.slice(0, 2)
  var Object = LittleEndian(message.slice(2, 6))
  Object = GetObject(Object.concat('_' + message.slice(6, 8)))
  var aux_message = message.slice(8, 16)

  if (['2F', '2B'].includes(CS) && sdoType == 'R_SDO') {
    //Shortening the data because anyway the drive doesn`t care if you send more bytes than necessary
    switch (CS) {
      case '2F':
        aux_message = aux_message.slice(0, 2)
        break
      case '2B':
        aux_message = aux_message.slice(0, 4)
        break
    }
  }

  var aux_message = LittleEndian(aux_message)

  if (Object[1] == 'Nothing Found' && !['60', '70'].includes(CS) && sdoType == 'R_SDO') {
    //We check if the SDO is R_SDO because of the segmented reading
    return [
      CS,
      Object[0],
      Object[1],
      aux_message,
      `SDO_Error: Couldn't find object : ${Object[0]}`,
      'error'
    ]
  }

  var checkForErrors = Check_SDOmsg_ForErrors(
    sdoType,
    CS,
    aux_message,
    Object[2],
    Object[0],
    message
  )

  interpretationInfo = checkForErrors[0]
  errorStatus = checkForErrors[1]
  aux_message = checkForErrors[2]
  var FG_typeObject = whatFG_isObject(Object[0])

  if (FG_typeObject && errorStatus == 'neutral') {
    var checkForFG = Check_SDOmsg_forFG(FG_typeObject, aux_message)
    interpretationInfo = checkForFG[0]
    errorStatus = checkForFG[1] // blue or neutral
  }

  if (errorStatus == 'neutral') {
    //No error and the other functions didnt write anything in interpretationInfo
    var ObjectValueDescription = whatObjectValueMeans(
      Object[0],
      aux_message,
      Object[2],
      sdoType,
      axisID,
      CS
    )
    if (ObjectValueDescription[0] && ObjectValueDescription[2] == 'whatValueMeansInObj') {
      interpretationInfo = ObjectValueDescription[0]
      errorStatus = ObjectValueDescription[1] //blue
    } else if (ObjectValueDescription[2] == 'adjust_StatusWord_or_ControlWord') {
      Object[0] = Object[0].concat(ObjectValueDescription[0])
      errorStatus = ObjectValueDescription[1] //neutral
      interpretationInfo = ObjectValueDescription[3]
    } else if (ObjectValueDescription[2] == 'SomethingFound') {
      interpretationInfo = ObjectValueDescription[0]
      errorStatus = ObjectValueDescription[1] //random
    }
    if (sdoType == 'R_SDO') {
      var MappingObject = checkSDOforMapping(Object[0], aux_message, axisID)
      if (MappingObject) {
        interpretationInfo = MappingObject[0]
        errorStatus = MappingObject[1] //Blue or error
      }
    }
  } else if (errorStatus == 'perfect') {
    //In case we are reading objects or just recieve a confirmation of writing/reading we will hide the 0 string
    if (
      (['40', '43', '4B', '4F'].includes(CS) && sdoType == 'R_SDO') ||
      (sdoType == 'T_SDO' && CS == '60')
    ) {
      aux_message = '-'
    }
  }

  //Return: [CS, Object , ObjectName , data , Interpretation ,errorStatus]
  return [CS, Object[0], Object[1], aux_message, interpretationInfo, errorStatus]
}

function Check_SDOmsg_ForErrors(sdoType, CS, data, ObjectSize, ObjectIndex, fullMessage) {
  //Returns [interpretationInfo, errorStatus]
  var interpretation = ''
  var errorStatus = ''

  switch (CS) {
    case '2F':
      if (sdoType == 'R_SDO') {
        if (ObjectSize != 8) {
          interpretation = 'Invalid CS for this object '
          errorStatus = 'error'
        } else if (data.length != 2 && parseInt(data.slice(0, data.length - 2)) != 0) {
          interpretation = 'The data should be 8bits '
          errorStatus = 'warning'
        } else {
          if (data.length != 2) data = data.slice(data.length - 2)

          interpretation = `Write: ${ObjectIndex} <- ${data}h`
          errorStatus = 'neutral'
        }
      } else {
        //T_SDO
        interpretation = '2F is a Command Specifier only for R_SDO'
        errorStatus = 'error'
      }

      break
    case '2B':
      if (sdoType == 'R_SDO') {
        if (ObjectSize != 16) {
          interpretation = 'Invalid CS for this object '
          errorStatus = 'error'
        } else if (data.length != 4 && parseInt(data.slice(0, data.length - 4)) != 0) {
          interpretation = 'The data should be 16bits '
          errorStatus = 'warning'
        } else {
          if (data.length != 4) data = data.slice(data.length - 4)

          interpretation = `Write: ${ObjectIndex} <- ${data}h`
          errorStatus = 'neutral'
        }
      } else {
        //T_SDO
        interpretation = '2B is a Command Specifier only for R_SDO'
        errorStatus = 'error'
      }

      break
    case '27':
    case '47':
      interpretation = ' Invalid CS for this Object'
      errorStatus = 'error'
      break
    case '23':
      if (sdoType == 'R_SDO') {
        if (ObjectSize != 32) {
          interpretation = 'Invalid CS for this object '
          errorStatus = 'error'
        } else if (data.length != 8) {
          errorStatus = 'neutral'
          data = data.padStart(8, '0')
        } else {
          interpretation = `Write: ${ObjectIndex} <- ${data}h`
          errorStatus = 'neutral'
        }
      } else {
        //T_SDO
        interpretation = '23 is a Command Specifier only for R_SDO'
        errorStatus = 'error'
      }

      break
    case '43':
      if (ObjectSize != 32) {
        interpretation = 'This CS should be used to read a 32bit object'
        errorStatus = 'warning'
      } else if (sdoType == 'T_SDO') {
        interpretation = `Read: ${ObjectIndex} -> ${data}h`
        errorStatus = 'neutral'
      }

      break
    case '4F':
      if (ObjectSize != 8) {
        interpretation = 'This CS should be used to read a 8bit object'
        errorStatus = 'warning'
      } else if (data.length != 8 && parseInt(data) != 0 && sdoType == 'T_SDO') {
        interpretation = 'The data length should be "00 00 00 00"'
        errorStatus = 'warning'
      } else if (sdoType == 'T_SDO') {
        if (data.length != 2) data = data.slice(data.length - 2)

        interpretation = `Read: ${ObjectIndex} -> ${data}h`
        errorStatus = 'neutral'
      }

      break
    case '4B':
      if (ObjectSize != 16) {
        interpretation = 'This CS should be used to read a 16bit object'
        errorStatus = 'warning'
      } else if (data.length != 8 && parseInt(data) != 0 && sdoType == 'T_SDO') {
        interpretation = 'The data length should be "00 00 00 00"'
        errorStatus = 'warning'
      } else if (sdoType == 'T_SDO') {
        if (data.length != 4) data = data.slice(data.length - 4)

        interpretation = `Read: ${ObjectIndex} ->  ${data}h`
        errorStatus = 'neutral'
      }

      break
    case '40':
      if (sdoType == 'T_SDO') {
        interpretation = '40 is a Command Specifier only for R_SDO'
        errorStatus = 'error'
      } else {
        interpretation = `Read object ${ObjectIndex}`
        errorStatus = 'perfect'
      }
      break

    case '41':
      if (sdoType == 'T_SDO') {
        interpretation = `Use Segmented Reading. There are ${hexToDec(data, 32)}bytes of Info`
        errorStatus = 'neutral'
      } else {
        interpretation = '"41" - Invalid CS for a R_SDO'
        errorStatus = 'warning'
      }
      break

    case '60':
      if (sdoType == 'T_SDO') {
        if (parseInt(data) == 0) {
          interpretation = `Writing in ${ObjectIndex} - OK `
          errorStatus = 'perfect'
        } else {
          interpretation = 'The data should be "00 00 00 00" confirming an OK to write'
          errorStatus = 'warning'
        }
      } else {
        //Drive don`t care what the data is
        interpretation = 'Request a segmented Read'
        errorStatus = 'neutral'
      }
      break
    case '70':
      if (sdoType == 'T_SDO') {
        interpretation = 'Invalid CS for T_SDO'
        errorStatus = 'error'
      } else {
        //Drive don`t care what the data is
        interpretation = 'Request a segmented Read'
        errorStatus = 'neutral'
      }
      break
    case '80':
      if (sdoType == 'T_SDO') {
        interpretation = `SDO_Abort: ${findSDO_AbortCode(data)}`
        errorStatus = 'error'
      } else {
        //Drive don`t care what the data is
        interpretation = 'Invalid CS'
        errorStatus = 'error'
      }
      break

    default:
      if (sdoType == 'T_SDO') {
        //Hoping for segmented reading
        interpretation = `${hex_to_ascii(fullMessage)}`
        errorStatus = 'random'
      } else {
        interpretation = `unknown SDO message`
        errorStatus = 'error'
      }
      break
  }
  return [interpretation, errorStatus, data]
}

function Check_SDOmsg_forFG(FG_typeObject, value) {
  var interpretationInfo = ''
  var errorStatus = 'neutral'
  const conversionParams = {
    Display: {
      POS: { converter: hexToDec, display: FG_OptionsObject_1.FG_Display_POS },
      SPD: { converter: hex2Fixed, display: FG_OptionsObject_1.FG_Display_SPD },
      ACC: { converter: hex2Fixed, display: FG_OptionsObject_1.FG_Display_ACC },
      TIME: { converter: hexToDec, display: FG_OptionsObject_1.FG_Display_TIME }
    },
    Applied: {
      POS: { converter: hexToDec, display: FG_OptionsObject_1.FG_Applied_POS },
      SPD: { converter: hexToDec, display: FG_OptionsObject_1.FG_Applied_SPD },
      ACC: { converter: hexToDec, display: FG_OptionsObject_1.FG_Applied_ACC },
      TIME: { converter: hexToDec, display: FG_OptionsObject_1.FG_Applied_TIME }
    }
  }

  const conversionType = conversionParams[FG_DisplayVSApplied_1][FG_typeObject]

  if (conversionType) {
    let value_initial
    if (FG_DisplayVSApplied_1 == 'Display') {
      value_initial = UnitsConvertor(
        conversionType.converter(value, 32),
        'IU',
        conversionType.display,
        FG_typeObject
      )
    } else {
      value_initial = conversionType.converter(value, 32)
    }

    interpretationInfo = `${value_initial} ${conversionType.display}`
    errorStatus = 'blue'
  }

  return [interpretationInfo, errorStatus]
}

export function checkSDOforMapping(object, data, axisID) {
  //We will get only R_SDO because T_SDO have errorStatus="perfect"
  object = object.toUpperCase()
  var interpretationInfo = ''
  var errorStatus = ''
  if (object.slice(0, 2) == '0X' || object.slice(0, 2) == '#X') {
    object = object.slice(2)
  }

  function SwitchForTPDO(pattern, cobID) {
    const cobIDOffsets = [384, 640, 896, 1152]
    const typePDOs = ['TPDO1', 'TPDO2', 'TPDO3', 'TPDO4']

    const index = parseInt(pattern, 10)
    if (index >= 0 && index < cobIDOffsets.length) {
      cobID += cobIDOffsets[index]
      cobID = cobID.toString(16).toUpperCase()
      const interpretationInfo = `[${cobID}h]`
      return [interpretationInfo, cobID, typePDOs[index]]
    }

    return ['', '']
  }
  function SwitchForRPDO(pattern, cobID) {
    const cobIDOffsets = [512, 768, 1024, 1280]
    const typePDOs = ['RPDO1', 'RPDO2', 'RPDO3', 'RPDO4']

    const index = parseInt(pattern, 10)
    if (index >= 0 && index < cobIDOffsets.length) {
      cobID += cobIDOffsets[index]
      cobID = cobID.toString(16).toUpperCase()
      const interpretationInfo = `[${cobID}h]`
      return [interpretationInfo, cobID, typePDOs[index]]
    }

    return ['', '']
  }
  if (Mapping_objects_array.includes(object)) {
    var aux_firstByte = object.slice(0, 2)
    var aux_secondByte = object.slice(2, 4)
    var aux_thirdByte
    if (object.length > 4) {
      aux_thirdByte = object.slice(5, 7)
    } else {
      aux_thirdByte = '00'
    }
    var cobID = axisID
    //Configuring COB_ID for TPDOs --------
    if (aux_firstByte == '18') {
      var temp = SwitchForTPDO(aux_secondByte, cobID)
      interpretationInfo = temp[0]
      cobID = temp[1]
      var typePDO = temp[2]
      //Array for Inhibit time and Event timer
      if (PDO_mapped_aux[typePDO][axisID] == undefined) {
        PDO_mapped_aux[typePDO][axisID] = {
          TransmissionType: '',
          InhibitTime: '',
          EventTimer: ''
        }
      }
      switch (aux_thirdByte) {
        case '00':
          interpretationInfo = interpretationInfo.concat(` -Nr of entries : ${data}`)
          break
        case '01':
          var temp
          if (data.slice(0, 1) == '8') temp = `Disable ${interpretationInfo}`
          else temp = `Enable ${interpretationInfo}`

          interpretationInfo = temp
          if (data.slice(5) != cobID) {
            interpretationInfo = `Mapping Error: the CobID should be ${cobID} and not ${data.slice(
              5
            )} `
            errorStatus = 'error'
          }
          break
        case '02':
          var temp
          var temp2
          data = hexToDec(data, 16)
          if (data == 0) {
            temp = ` - Transmission - Reserved`
            temp2 = `${data} - Reserved`
          } else if (data > 0 && data <= 240) {
            temp = ` - synchronous( cyclic every ${data} SYNC)`
            temp2 = `Cyclic every ${data} SYNC`
          } else if (data > 240 && data <= 251) {
            temp = ` - Transmission - Reserved`
            temp2 = `${data}`
          } else if (data == 252) {
            temp = ` - RTR-Only (synchronous): The data are copied upon arrival of each SYNC message but are sent only upon request with an RTR message.`
            temp2 = `${data} - RTR-Only (synchronous)`
          } else if (data == 253) {
            temp = ` - RTR-Only (event-driven): The data are copied to the TX-PDO message upon receipt of an RTR message and sent immediately thereafter`
            temp2 = `${data} - RTR-Only (event-driven)`
          } else if (data == 254 || data == 255) {
            temp = ` - Event-driven (asynchronous)`
            temp2 = `Async`
          }
          interpretationInfo = interpretationInfo.concat(temp)
          PDO_mapped_aux[typePDO][axisID].TransmissionType = temp2

          break
        case '03':
          var aux = hexToDec(data, 32) / 10
          interpretationInfo = interpretationInfo.concat(` - Inhibit time : ${aux}ms`)
          PDO_mapped_aux[typePDO][axisID].InhibitTime = aux
          break
        case '04':
          interpretationInfo = interpretationInfo.concat(` - Subindex Reserved`)
          break
        case '05':
          var aux = hexToDec(data, 32)
          interpretationInfo = interpretationInfo.concat(` - Event timer : ${aux}ms`)
          PDO_mapped_aux[typePDO][axisID].EventTimer = aux
          break
      }
    } else if (aux_firstByte == '1A') {
      var temp = SwitchForTPDO(aux_secondByte, cobID)
      interpretationInfo = temp[0]
      cobID = temp[1]
      var typePDO = temp[2]

      switch (aux_thirdByte) {
        case '00':
          interpretationInfo = interpretationInfo.concat(` - Nr of mapped objects : ${data}`)
          break
        case '01':
        case '02':
        case '03':
        case '04':
          var object = ''.concat(data.slice(0, 4) + '_' + data.slice(4, 6))
          object = GetObject(object)
          var subindexNr = parseInt(aux_thirdByte)
          //How many bytes the object is being mapped on
          var mappingSize = data.slice(6, 8)
          if (mappingSize == '08') {
            mappingSize = 8
          } else if (mappingSize == '10') {
            mappingSize = 16
          } else if (mappingSize == '20') {
            mappingSize = 32
          }
          //Check if Object size is not equal to the defined mapping size
          if (mappingSize != object[2]) {
            interpretationInfo = `Mapping Error:  ${object[0]} has ${object[2]} bits, not ${mappingSize}bits`
            errorStatus = 'error'
          } else {
            interpretationInfo = interpretationInfo.concat(
              `[${subindexNr}] - ${object[0]} - ${object[1]}`
            )
            if (!PDO_mapped[typePDO][axisID]) {
              PDO_mapped[typePDO][axisID] = []
            }
            PDO_mapped[typePDO][axisID][subindexNr - 1] = object[0]
          }

          break
      }
    } else if (aux_firstByte == '14') {
      var temp = SwitchForRPDO(aux_secondByte, cobID)
      interpretationInfo = temp[0]
      cobID = temp[1]
      var typePDO = temp[2]
      //Array for Inhibit time and Event timer
      if (PDO_mapped_aux[typePDO][axisID] == undefined) {
        PDO_mapped_aux[typePDO][axisID] = {
          TransmissionType: ''
        }
      }
      switch (aux_thirdByte) {
        case '00':
          interpretationInfo = interpretationInfo.concat(` -Nr of entries : ${data}`)
          break
        case '01':
          var temp
          if (data.slice(0, 1) == '8') temp = `Disable ${interpretationInfo}`
          else temp = `Enable ${interpretationInfo}`
          interpretationInfo = temp

          if (data.slice(5) != cobID) {
            interpretationInfo = `Mapping Error: the CobID should be ${cobID} and not ${data.slice(
              5
            )} `
            errorStatus = 'error'
          }
          break
        case '02':
          var temp
          var temp2
          data = hexToDec(data, 16)
          if (data >= 0 && data <= 240) {
            temp = ` - synchronous( cyclic every ${data} SYNC)`
            temp2 = `cyclic every ${data} SYNC`
          } else if (data > 240 && data <= 253) {
            temp = ` - Transmission - Reserved`
            temp2 = `${data} reserved`
          } else if (data == 254 || data == 255) {
            temp = ` - Asynchronous: the PDO will be sent every time anything changes in its data field`
            temp2 = `Async`
          }
          interpretationInfo = interpretationInfo.concat(temp)
          PDO_mapped_aux[typePDO][axisID].TransmissionType = temp2

          break
      }
    } else if (aux_firstByte == '16') {
      var temp = SwitchForRPDO(aux_secondByte, cobID)
      interpretationInfo = temp[0]
      cobID = temp[1]
      var typePDO = temp[2]

      switch (aux_thirdByte) {
        case '00':
          interpretationInfo = interpretationInfo.concat(` - Nr of mapped objects : ${data}`)
          break
        case '01':
        case '02':
        case '03':
        case '04':
          var object = ''.concat(data.slice(0, 4) + '_' + data.slice(4, 6))
          object = GetObject(object)
          var subindexNr = parseInt(aux_thirdByte)
          //How many bytes the object is being mapped on
          var mappingSize = data.slice(6, 8)
          if (mappingSize == '08') {
            mappingSize = 8
          } else if (mappingSize == '10') {
            mappingSize = 16
          } else if (mappingSize == '20') {
            mappingSize = 32
          }
          //Check if Object size is not equal to the defined mapping size
          if (mappingSize != object[2]) {
            interpretationInfo = `Mapping Error:  ${object[0]} has ${object[2]} bits, not ${mappingSize}bits`
            errorStatus = 'error'
          } else {
            interpretationInfo = interpretationInfo.concat(
              `[${subindexNr}] - ${object[0]} - ${object[1]}`
            )
            if (!PDO_mapped[typePDO][axisID]) {
              PDO_mapped[typePDO][axisID] = []
            }
            PDO_mapped[typePDO][axisID][subindexNr - 1] = object[0]
          }

          break
      }
    }

    if (errorStatus == '') errorStatus = 'blue'
    return [interpretationInfo, errorStatus]
  } else return null
}

function findSDO_AbortCode(data) {
  const result = SDO_abortCodes.find((item) => item.Index === data)
  if (result) {
    return result.Name
  } else return 'Unknown Abort Code'
}
// ********************** //PDO FUNCTIONS// ********************************
export let PDO_mapped = {
  //Pos 0 will not be used, only 1 to 127
  RPDO1: [],
  RPDO2: [],
  RPDO3: [],
  RPDO4: [],
  TPDO1: [],
  TPDO2: [],
  TPDO3: [],
  TPDO4: []
}
export let PDO_mapped_aux = {
  //Pos 0 will not be used, only 1 to 127
  //Here we will have Transmission type/ Inhibit time/ Event timer
  RPDO1: [],
  RPDO2: [],
  RPDO3: [],
  RPDO4: [],
  TPDO1: [],
  TPDO2: [],
  TPDO3: [],
  TPDO4: []
}
export let DontBotherWithPDO_flag = [1] // BUG change to zero
export let SetAllPDOsEMPTY = [0]

export function DecodeOnePDOmsg(cobID_array, message) {
  const CompatibleMapping_NoSpace1 = {
    8: ['6060'],
    16: ['6041'],
    24: ['6041', '100D'],
    32: ['6041', '208E'],
    40: ['6081', '6060'],
    48: ['607A', '2023'],
    56: ['607A', '6041', '6061'],
    64: ['607A', '6081']
  }
  if (message == 'INVALID') {
    return helping_DecodePDO(cobID_array, message)
  }
  if (DontBotherWithPDO_flag[0] && !PDO_mapped[cobID_array[2]][cobID_array[1]]) {
    // We write some dummy data just to get rid of PDO filling requirements
    var frameData = message
    if (frameData.length % 2 != 0) {
      frameData =
        frameData.slice(0, frameData.length - 1) +
        '0' +
        frameData.slice(frameData.length - 1, frameData.length)
    }

    frameData = frameData.length * 4

    PDO_mapped[cobID_array[2]][cobID_array[1]] = CompatibleMapping_NoSpace1[frameData]
  } else if (SetAllPDOsEMPTY[0] && !PDO_mapped[cobID_array[2]][cobID_array[1]]) {
    //WE dont know anything about this PDO so we leave it empty
    PDO_mapped[cobID_array[2]][cobID_array[1]] = ['--']
  }
  //---------------zzz
  if (!PDO_mapped[cobID_array[2]][cobID_array[1]]) {
    //We don't have any data for this PDO
    return ['MissingPDO', '-', '-', '-', 'PDO_Error: No data for this PDO', 'error']
  }

  return helping_DecodePDO(cobID_array, message)
}

export function helping_DecodePDO(cobID_array, message) {
  if (message == '-' || message == 'INVALID') {
    return ['-', '-', '-', '-', 'PDO_Error: invalid message', 'error']
  }
  var MappedObjects = PDO_mapped[cobID_array[2]][cobID_array[1]]
  var CS = MappedObjects.length

  var aux_frame = message

  let aux_objects = []
  let aux_objectsName = []
  let aux_objectsData = []
  let aux_Interpretation = []
  var aux_error = []

  MappedObjects.forEach((object, index) => {
    const [objectIndex, objectName, objectSize] = GetObject(object)
    const FG_typeObject = whatFG_isObject(objectIndex)

    // Process object data
    let obj_msg = LittleEndian(aux_frame.slice(0, objectSize / 4))
    aux_objects = aux_objects.concat(objectIndex)
    aux_objectsName = aux_objectsName.concat(objectName)

    if (obj_msg.legnth != objectSize / 4) {
      //In case data is insufficiet
      obj_msg = obj_msg.padStart(objectSize / 4, '0')
    }
    aux_objectsData = aux_objectsData.concat(obj_msg)
    aux_frame = aux_frame.slice(objectSize / 4)

    var tempInterpretation, tempError, typeFct
    if (FG_typeObject) {
      // Factor Group
      ;[tempInterpretation, tempError] = Check_SDOmsg_forFG(FG_typeObject, obj_msg)
    } else {
      //Maybe we have info on the object or we do something with 6060 6041 and 6040

      var aux = whatObjectValueMeans(
        objectIndex,
        obj_msg,
        objectSize,
        cobID_array[2],
        cobID_array[1],
        CS
      )
      if (aux[2] == 'whatValueMeansInObj') {
        tempInterpretation = aux[0]
        tempError = aux[1]
        if (aux[0] == false) tempInterpretation = '-'
      } else if (aux[2] == 'adjust_StatusWord_or_ControlWord') {
        aux_objects = aux_objects.concat(aux[0])
        tempError = aux[1]
        tempInterpretation = aux[3]
      } else if (aux[2] == 'SomethingFound') {
        tempInterpretation = aux[0]
        tempError = aux[1]
      } else {
        //Nothing found or done
        tempInterpretation = '-'
      }
    }
    aux_Interpretation = aux_Interpretation.concat(tempInterpretation)
    aux_error = aux_error.concat(tempError)

    if (index < MappedObjects.length - 1) {
      aux_objects.push(' / ')
      aux_objectsName.push(' / ')
      aux_objectsData.push(' / ')
      aux_Interpretation.push(' / ')
    }
  })

  // Combine arrays into strings
  aux_objects = aux_objects.join('')
  aux_objectsName = aux_objectsName.join('')
  aux_objectsData = aux_objectsData.join('')
  aux_Interpretation = aux_Interpretation.join('')

  if (aux_error.includes('error')) {
    aux_error = 'error'
  } else if (aux_error.includes('blue')) {
    aux_error = 'blue'
  } else {
    aux_error = 'neutral'
  }

  return [CS, aux_objects, aux_objectsName, aux_objectsData, aux_Interpretation, aux_error]
}

// ********************** //Remaining CANopen Protocols FUNCTIONS// ********************************

export function DecodeEMCY(message) {
  var CS = ''
  var Object = ''
  var ObjectName = ''
  var Data = ''
  var Interpretation = 'EMCY : '
  var errorStatus = 'error'

  function getEMCY(error_code) {
    const result = EMCYcodes.find((item) => item.Index === error_code)
    if (result) {
      return result.Name
    } else return 'Unknown EMCY Code'
  }

  var error_code = LittleEndian(message.slice(0, 4))
  Interpretation = Interpretation.concat(error_code)
  var temp = getEMCY(error_code)
  if (!temp) temp = 'Unknown EMCY message'
  Interpretation = Interpretation.concat(' - ', temp)

  if (error_code == '7500') {
    Object = '1001 / 2003'
    ObjectName = `${GetObject('1001')[1]} / ${GetObject('2003')[1]}`
    Data = `${message.slice(4, 6)} / ${LittleEndian(message.slice(6, 10))}`
  } else if (error_code == '7300') {
    Object = '1001 / 2009'
    ObjectName = `${GetObject('1001')[1]} / ${GetObject('2009')[1]}`
    Data = `${message.slice(4, 6)} / ${LittleEndian(message.slice(6, 10))}`
  } else if (error_code == 'FF01') {
    Object = '1001 / 2072'
    ObjectName = `${GetObject('1001')[1]} / ${GetObject('2072')[1]}`
    Data = `${message.slice(4, 6)} / ${LittleEndian(message.slice(6, 10))}`
  } else {
    Object = '1001'
    ObjectName = `${GetObject('1001')[1]}`
    Data = `${message.slice(4, 6)} `
  }

  return [CS, Object, ObjectName, Data, Interpretation, errorStatus]
}

export function DecodeNMT(message) {
  var interpretation = 'NMT '
  var errorStatus = 'blue'
  var CS
  if (message.length > 4) {
    interpretation = 'DATA too big for this type of message'
    errorStatus = 'error'
  } else if (message.length < 4) {
    interpretation = 'DATA too short for this type of message'
    errorStatus = 'error'
  }
  if (errorStatus != 'error') {
    CS = message.slice(0, 2)

    if (CS == '80') {
      interpretation = 'Enter Pre-Operational'
    } else if (CS == '82') {
      interpretation = 'Reset Communication'
    } else if (CS == '81') {
      interpretation = 'Reset Node'
    } else if (CS == '01') {
      interpretation = 'Start Remote Node'
    } else if (CS == '02') {
      interpretation = 'Stop Remote Node'
    } else {
      interpretation = 'Unknown Command Specifier '
      errorStatus = 'error'
    }
  }

  return [CS, message.slice(2), '-', '-', interpretation, errorStatus]
}

export function DecodeNMT_Monitoring(message) {
  //Possible bug for NodeGuarding protocol
  //the CMD is one byte and bit 7 alternates between 1 and 0

  var CS = message
  var interpretation
  var errorStatus

  if (message.length > 2) {
    interpretation = `${CS} - DATA too big for this type of message`
    errorStatus = 'error'
    CS = '-'
  } else {
    if (message == '') {
      interpretation = 'RTR request from master'
    } else {
      switch (message) {
        case '05':
        case '5':
          interpretation = 'NMT Operational'
          break
        case '04':
        case '4':
          interpretation = 'NMT Stopped'
          break
        case '7F':
          interpretation = 'NMT Pre-Operational'
          break
        case '00':
          interpretation = 'Boot Up'
          break
        case '0':
          //we are making an assumption that the 0 means the length of the message
          interpretation = 'RTR request from master'
          break
        default:
          interpretation = `${CS} - Unknown NMT state for the slave`
          CS = '-'
          errorStatus = 'error'
          break
      }
    }
  }
  return [CS, '-', '-', '-', interpretation, errorStatus]
}

export function DecodeSYNC(message) {
  var interpretation = 'SYNC'
  var errorStatus = 'neutral'

  return ['-', '-', '-', '-', interpretation, errorStatus]
}
// ********************** //MAPPING FUNCTIONS// ********************************

export function whatPDOisObject(object) {
  object = object.toUpperCase()
  if (object.slice(0, 2) == '0X' || object.slice(0, 2) == '#X') {
    object = object.slice(2)
  }

  for (const prop in Mapping_objects_array_basedOnType) {
    if (Mapping_objects_array_basedOnType[prop].includes(object)) {
      return prop
    }
  }
  return null
}

export function SortMappingByAxis(PDO_mapped) {
  var sortedArray = []

  Object.keys(PDO_mapped).forEach((PDO_type) => {
    PDO_mapped[PDO_type].forEach((oneMapping, AxisID) => {
      let found = false
      //Checking if the AxisID Array already exists in the array
      for (let i = 0; i < sortedArray.length; i++) {
        if (sortedArray[i].AxisID === AxisID) {
          sortedArray[i][PDO_type] = helping_ProvideMappingInfo(PDO_type, AxisID, oneMapping)
          found = true
          break
        }
      }
      if (!found) {
        let newObj = { AxisID: AxisID }
        newObj[PDO_type] = helping_ProvideMappingInfo(PDO_type, AxisID, oneMapping)
        sortedArray.push(newObj)
      }
    })
  })

  return sortedArray
}

function helping_ProvideMappingInfo(PDO_type, AxisID, oneMapping) {
  var NrOfMappedObj = oneMapping.length
  var aux_CobID
  var arrayOfObjectsInfo = []
  switch (PDO_type) {
    case 'TPDO1':
      aux_CobID = decToHex(384 + AxisID, 16)

      break
    case 'TPDO2':
      aux_CobID = decToHex(640 + AxisID, 16)

      break
    case 'TPDO3':
      aux_CobID = decToHex(896 + AxisID, 16)

      break
    case 'TPDO4':
      aux_CobID = decToHex(1152 + AxisID, 16)

      break
    case 'RPDO1':
      aux_CobID = decToHex(512 + AxisID, 16)

      break
    case 'RPDO2':
      aux_CobID = decToHex(768 + AxisID, 16)

      break
    case 'RPDO3':
      aux_CobID = decToHex(1024 + AxisID, 16)

      break
    case 'RPDO4':
      aux_CobID = decToHex(1280 + AxisID, 16)

      break
  }
  oneMapping.forEach((oneObject, index) => {
    var objectFound = GetObject(oneObject)
    var moreDetails = PDO_mapped_aux[PDO_type][AxisID]
    var String = ''
    if (moreDetails) {
      if (moreDetails.TransmissionType && moreDetails.TransmissionType != '') {
        String = String.concat(` ${moreDetails.TransmissionType} /`)
      }
      if (moreDetails.InhibitTime && moreDetails.InhibitTime != '') {
        String = String.concat(` InhibitTime: ${moreDetails.InhibitTime} /`)
      }
      if (moreDetails.EventTimer && moreDetails.EventTimer != '') {
        String = String.concat(` EventTimer: ${moreDetails.EventTimer} /`)
      }
      String = String.slice(0, -1)
    }
    arrayOfObjectsInfo[index] = [
      `${aux_CobID}h [${index + 1}] `,
      objectFound[0],
      objectFound[1],
      objectFound[2],
      String
    ]
  })

  return arrayOfObjectsInfo
}
