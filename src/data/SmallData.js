/*------------------------------Global Parameters------------------------------ */
//PDO_mapped
//CanLogStatistics
export let GroupingOptionsForMessages = {
  Mapping: false,
  Modes: false,
  Repetitive: false
}

export const ObjectDescriptions = {
  6060: {
    '-5': 'Manufacturer specific – External Reference Torque Mode1',
    '-4': 'Manufacturer specific – External Reference Speed Mode1',
    '-3': 'Manufacturer specific – External Reference Position Mode1',
    '-2': 'Manufacturer specific – Electronic Camming Position Mode',
    '-1': 'Manufacturer specific – Electronic Gearing Position Mode',
    0: 'Reserved',
    1: 'Profile Position Mode',
    2: 'Reserved',
    3: 'Profile Velocity Mode',
    4: 'Profile Torque Mode1',
    5: 'Reserved',
    6: 'Homing Mode',
    7: 'Interpolated Position Mode',
    8: 'Cyclic Synchronous Position Mode (CSP)',
    9: 'Cyclic sync Velocity Mode (CSV)2',
    10: 'Cyclic sync Torque Mode (CST)2'
  },
  6061: {
    '-5': 'Manufacturer specific – External Reference Torque Mode1',
    '-4': 'Manufacturer specific – External Reference Speed Mode1',
    '-3': 'Manufacturer specific – External Reference Position Mode1',
    '-2': 'Manufacturer specific – Electronic Camming Position Mode',
    '-1': 'Manufacturer specific – Electronic Gearing Position Mode',
    0: 'Reserved',
    1: 'Profile Position Mode',
    2: 'Reserved',
    3: 'Profile Velocity Mode',
    4: 'Profile Torque Mode1',
    5: 'Reserved',
    6: 'Homing Mode',
    7: 'Interpolated Position Mode',
    8: 'Cyclic Synchronous Position Mode (CSP)',
    9: 'Cyclic sync Velocity Mode (CSV)2',
    10: 'Cyclic sync Torque Mode (CST)2'
  },
  '605E': {
    '-1': 'No action',
    0: 'Disable drive, motor is free to rotate',
    1: 'Reserved',
    2: 'Slow down with quick stop ramp'
  },
  '605A': {
    0: 'Disable drive function',
    1: 'Slow down on slow down ramp and transit into Switch On Disabled',
    2: 'Slow down on quick stop ramp and transit into Switch On Disabled',
    3: 'Reserved',
    4: 'Reserved',
    5: 'Slow down on slow down ramp and stay in Quick Stop Active',
    6: 'Slow down on quick stop ramp and stay in Quick Stop Active'
  },
  '605B': {
    0: 'Disable drive function (switch-off the drive power stage)',
    1: 'Slow down on slowdown ramp'
  },
  '605C': {
    0: 'Disable drive function (switch-off the drive power stage)',
    1: 'Slow down on slow down ramp and disable the drive function'
  },
  '605D': {
    0: 'Reserved',
    1: 'Slow down on slow down ramp and stay in Operation Enabled',
    2: 'Slow down on quick stop ramp'
  },
  6007: {
    0: 'No action',
    1: 'Fault signal - Execute specific fault routine set in Object 605Eh: Fault reaction option code',
    2: 'Disable voltage command',
    3: 'Quick stop command'
  },
  6098: {
    '-4': 'Method -4',
    '-3': 'Method -3',
    '-2': 'Method -2',
    '-1': 'Method -1',
    0: 'No homing operation will be executed',
    1: 'Method 1',
    2: 'Method 2',
    3: 'Method 3',
    4: 'Method 4',
    5: 'Method 5',
    6: 'Method 6',
    7: 'Method 7',
    8: 'Method 8',
    9: 'Method 9',
    10: 'Method 10',
    11: 'Method 11',
    12: 'Method 12',
    13: 'Method 13',
    14: 'Method 14',
    15: 'Reserved',
    16: 'Reserved',
    17: 'Method 17',
    18: 'Method 18',
    19: 'Method 19',
    20: 'Method 20',
    21: 'Method 21',
    22: 'Method 22',
    23: 'Method 23',
    24: 'Method 24',
    25: 'Method 25',
    26: 'Method 26',
    27: 'Method 27',
    28: 'Method 28',
    29: 'Method 29',
    30: 'Method 30',
    31: 'Reserved',
    32: 'Reserved',
    33: 'Method 33',
    34: 'Method 34',
    35: 'Method 35'
  },
  6086: {
    0: 'Linear ramp (trapezoidal profile)',
    1: 'Reserved',
    2: 'Reserved',
    3: 'Jerk-limited ramp (S-curve)'
  },
  '201D': {
    0: 'Reserved',
    1: `On-line.
    In case of External Reference Position / Speed / Torque Modes, select this option in 
    order to read the reference from the object 201C, External Online Reference
    In case of Electronic Gearing and Camming Position Modes, select this option in 
    order to read the master position received from a master drive via communication
    (object 201Eh).`,
    2: `Analogue.
    In case of External Reference Position / Speed / Torque Modes, select this option in 
    order to read the reference from the dedicated analogue input`,
    3: `Digital.
    In case of External Reference Position Modes, select this option in order to read the 
    reference from the dedicated digital inputs as set in the setup made using 
    EasySetUp / EasyMotion Studio (either 2nd encoder or pulse & direction).
    In case of Electronic Gearing and Camming Position Modes, select this option in 
    order to read master position from the dedicated digital inputs as set in the setup 
    made using EasySetUp / EasyMotion Studio (either 2nd encoder or pulse & 
    direction).
    `
  }
}

/*------------------------------Factor Group Units------------------------------ */

export const FG_Objects_Array = {
  POS: [
    '6064',
    '6062',
    '607A',
    '60F4',
    '6063',
    '607B_01',
    '607B_02',
    '607C',
    '6067',
    '2079',
    '2075_01',
    '2075_02',
    '2075_03',
    '2075_04',
    '20A0_02',
    '608F',
    '6065',
    '2081',
    '2088',
    '201E',
    '2012',
    '2017',
    '60BA',
    '60BB',
    '60BC',
    '60BD',
    '2106',
    '2107'
  ],
  SPD: [
    '606C',
    '606B',
    '606F',
    '60FF',
    '60F8',
    '6081',
    '6099_01',
    '6099_02',
    '20A0_03',
    '6069',
    '606F',
    '2087',
    '2018',
    '201C'
  ],
  ACC: ['6083', '6085', '609A'],
  TIME: ['6066', '6068', '2023', '2005', '2051', '1017', ' 100C', '207C', '207A', '606E']
}

export const FG_units_pos_rot = ['IU', 'rad', 'deg', 'rot']
export const FG_units_spd_rot = ['IU', 'rad/s', 'rpm', 'rps', 'deg/s', 'deg/min', 'in/s']
export const FG_units_acc_rot = ['IU', 'rad/s^2', 'deg/s^2', 'rot/s^2', 'krad/s^2', 'in/s^2']
export const FG_units_jerk_rot = ['IU', 'rad/s^3', 'deg/s^3', 'rot/s^3', 'krad/s^3', 'in/s^3']
export const FG_units_spd_lin = ['IU', 'm/s', 'mm/s', 'um/s', 'mm/min', 'in/s']
export const FG_units_pos_lin = ['IU', 'm', 'mm', 'um']
export const FG_units_acc_lin = ['IU', 'm/s^2', 'mm/s^2', 'um/s^2', 'in/s^2']
export const FG_units_jerk_lin = ['IU', 'm/s^3', 'mm/s^3', 'um/s^3', 'in/s^3']
export const FG_units_time = ['IU', 'ms', 's']
export const Types_of_CANopenMsgs_array = [
  ' NMT',
  ' EMCY',
  ' RPDO1',
  ' RPDO2',
  ' RPDO3',
  ' RPDO4',
  ' TPDO1',
  ' TPDO2',
  ' TPDO3',
  ' TPDO4',
  ' TSDO',
  ' RSDO',
  ' NMT_M',
  ' TCAN',
  ' Errors'
]

export var DefaultPDOs = {
  RPDO1: ['6040', '00', '', '', '', '', '', ''],
  RPDO2: ['6040', '00', '6060', '00', '', '', '', ''],
  RPDO3: ['6040', '00', '607A', '00', '', '', '', ''],
  RPDO4: ['6040', '00', '60FF', '00', '', '', '', ''],
  TPDO1: ['6041', '00', '', '', '', '', '', ''],
  TPDO2: ['6041', '00', '6061', '00', '', '', '', ''],
  TPDO3: ['6041', '00', '6064', '00', '', '', '', ''],
  TPDO4: ['6041', '00', '606C', '00', '', '', '', '']
}

export const CompatibleMapping = {
  8: ['6060', '', '', '', '', '', '', ''],
  16: ['6041', '', '', '', '', '', '', ''],
  24: ['6041', '', '100D', '', '', '', '', ''],
  32: ['6085', '', '', '', '', '', '', ''],
  40: ['6081', '', '6060', '', '', '', '', ''],
  48: ['607A', '', '2023', '', '', '', '', ''],
  56: ['607A', '', '6041', '', '6061', '', '', ''],
  64: ['607A', '', '6081', '', '', '', '', '']
}

export const Mapping_objects_array = [
  '1400',
  '1400_00',
  '1400_01',
  '1400_02',
  '1401',
  '1401_00',
  '1401_01',
  '1401_02',
  '1402',
  '1402_00',
  '1402_01',
  '1402_02',
  '1403',
  '1403_00',
  '1403_01',
  '1403_02',
  '1600',
  '1600_00',
  '1600_01',
  '1600_02',
  '1600_03',
  '1600_04',
  '1601',
  '1601_00',
  '1601_01',
  '1601_02',
  '1601_03',
  '1601_04',
  '1602',
  '1602_00',
  '1602_01',
  '1602_02',
  '1602_03',
  '1602_04',
  '1603',
  '1603_00',
  '1603_01',
  '1603_02',
  '1603_03',
  '1603_04',
  '1800',
  '1800_00',
  '1800_01',
  '1800_02',
  '1800_03',
  '1800_04',
  '1800_05',
  '1801',
  '1801_00',
  '1801_01',
  '1801_02',
  '1801_03',
  '1801_04',
  '1801_05',
  '1802',
  '1802_00',
  '1802_01',
  '1802_02',
  '1802_03',
  '1802_04',
  '1802_05',
  '1803',
  '1803_00',
  '1803_01',
  '1803_02',
  '1803_03',
  '1803_04',
  '1803_05',
  '1A00',
  '1A00_00',
  '1A00_01',
  '1A00_02',
  '1A00_03',
  '1A00_04',
  '1A01',
  '1A01_00',
  '1A01_01',
  '1A01_02',
  '1A01_03',
  '1A01_04',
  '1A02',
  '1A02_00',
  '1A02_01',
  '1A02_02',
  '1A02_03',
  '1A02_04',
  '1A03',
  '1A03_00',
  '1A03_01',
  '1A03_02',
  '1A03_03',
  '1A03_04'
]

export const Mapping_objects_array_basedOnType = {
  RPDO1: [
    '1400',
    '1400_00',
    '1400_01',
    '1400_02',
    '1600',
    '1600_00',
    '1600_01',
    '1600_02',
    '1600_03',
    '1600_04'
  ],
  RPDO2: [
    '1401',
    '1401_00',
    '1401_01',
    '1401_02',
    '1601',
    '1601_00',
    '1601_01',
    '1601_02',
    '1601_03',
    '1601_04'
  ],
  RPDO3: [
    '1402',
    '1402_00',
    '1402_01',
    '1402_02',
    '1602',
    '1602_00',
    '1602_01',
    '1602_02',
    '1602_03',
    '1602_04'
  ],
  RPDO4: [
    '1403',
    '1403_00',
    '1403_01',
    '1403_02',
    '1603',
    '1603_00',
    '1603_01',
    '1603_02',
    '1603_03',
    '1603_04'
  ],
  TPDO1: [
    '1800',
    '1800_00',
    '1800_01',
    '1800_02',
    '1800_03',
    '1800_04',
    '1800_05',
    '1A00',
    '1A00_00',
    '1A00_01',
    '1A00_02',
    '1A00_03',
    '1A00_04'
  ],
  TPDO2: [
    '1801',
    '1801_00',
    '1801_01',
    '1801_02',
    '1801_03',
    '1801_04',
    '1801_05',
    '1A01',
    '1A01_00',
    '1A01_01',
    '1A01_02',
    '1A01_03',
    '1A01_04'
  ],
  TPDO3: [
    '1802',
    '1802_00',
    '1802_01',
    '1802_02',
    '1802_03',
    '1802_04',
    '1802_05',
    '1A02',
    '1A02_00',
    '1A02_01',
    '1A02_02',
    '1A02_03',
    '1A02_04'
  ],
  TPDO4: [
    '1803',
    '1803_00',
    '1803_01',
    '1803_02',
    '1803_03',
    '1803_04',
    '1803_05',
    '1A03',
    '1A03_00',
    '1A03_01',
    '1A03_02',
    '1A03_03',
    '1A03_04'
  ]
}

export const EMCYcodes = [
  {
    Index: '0000',
    Name: 'Error Reset or No Error'
  },
  {
    Index: '1000',
    Name: 'Generic Error; sent when a communication error occurs on CAN (object 2000h bit0=1; usually followed by EMCY code 0x7500'
  },
  {
    Index: '2310',
    Name: 'Continuous over-current'
  },
  {
    Index: '2340',
    Name: 'Short-circuit'
  },
  {
    Index: '3210',
    Name: 'DC-link over-voltage'
  },
  {
    Index: '3220',
    Name: 'DC-link under-voltage'
  },
  {
    Index: '4280',
    Name: 'Over temperature motor'
  },
  {
    Index: '4310',
    Name: 'Over temperature drive'
  },
  {
    Index: '5441',
    Name: 'Drive disabled due to enable or STO input'
  },
  {
    Index: '5442',
    Name: 'Negative limit switch active'
  },
  {
    Index: '5443',
    Name: 'Positive limit switch active'
  },
  {
    Index: '6100',
    Name: 'Invalid setup data'
  },
  {
    Index: '7300',
    Name: 'Sensor error'
  },
  {
    Index: '7500',
    Name: 'Communication error'
  },
  {
    Index: '8110',
    Name: 'CAN overrun (message lost)'
  },
  {
    Index: '8210',
    Name: 'Assuming - the PDO length you are trying to write to is not correct'
  },
  {
    Index: '8130',
    Name: 'Life guard error or heartbeat error'
  },
  {
    Index: '8331',
    Name: 'I2t protection triggered'
  },
  {
    Index: '8580',
    Name: 'Position wraparound'
  },
  {
    Index: '8611',
    Name: 'Control error / Following error'
  },
  {
    Index: '9000',
    Name: 'Command error'
  },
  {
    Index: 'FF01',
    Name: 'Generic interpolated position mode error (PVT / PT error)'
  },
  {
    Index: 'FF02',
    Name: 'Change set acknowledge bit wrong value'
  },
  {
    Index: 'FF03',
    Name: 'Specified homing method not available'
  },
  {
    Index: 'FF04',
    Name: 'A wrong mode is set in object 6060h, modes of operation'
  },
  {
    Index: 'FF05',
    Name: 'Specified digital I/O line not available'
  },
  {
    Index: 'FF06',
    Name: 'Positive software position limit triggered'
  },
  {
    Index: 'FF07',
    Name: 'Negative software position limit triggered'
  },
  {
    Index: 'FF08',
    Name: 'Enable circuit hardware error'
  }
]

export const SDO_abortCodes = [
  {
    Index: '05030000',
    Name: 'Toggle bit not changed.'
  },
  {
    Index: '05040000',
    Name: 'SDO protocol timed out.'
  },
  {
    Index: '05040001',
    Name: 'Client/server command specifier not valid or unknown.'
  },
  {
    Index: '05040002',
    Name: 'Invalid block size (block mode only).'
  },
  {
    Index: '05040003',
    Name: 'Invalid sequence number (block mode only).'
  },
  {
    Index: '05040004',
    Name: 'CRC error (block mode only).'
  },
  {
    Index: '05040005',
    Name: 'Out of memory.'
  },
  {
    Index: '06010000',
    Name: 'Unsupported access to an object.'
  },
  {
    Index: '06010001',
    Name: 'Attempt to read a write-only object.'
  },
  {
    Index: '06010002',
    Name: 'Attempt to write a read-only object.'
  },
  {
    Index: '06020000',
    Name: 'Object does not exist in the object dictionary.'
  },
  {
    Index: '06040041',
    Name: 'Object cannot be mapped to the PDO.'
  },
  {
    Index: '06040042',
    Name: 'The number and length of the objects to be mapped would exceed PDO length.'
  },
  {
    Index: '06040043',
    Name: 'General parameter incompatibility reason.'
  },
  {
    Index: '06040047',
    Name: 'General internal incompatibility in the device.'
  },
  {
    Index: '06060000',
    Name: 'Access failed due to a hardware error.'
  },
  {
    Index: '06070010',
    Name: 'Data type does not match; length of service parameter does not match.'
  },
  {
    Index: '06070012',
    Name: 'Data type does not match; length of service parameter too high.'
  },
  {
    Index: '06070013',
    Name: 'Data type does not match; length of service parameter too low.'
  },
  {
    Index: '06090011',
    Name: 'Sub-index does not exist.'
  },
  {
    Index: '06090030',
    Name: 'Value range of parameter exceeded (only for write access).'
  },
  {
    Index: '06090031',
    Name: 'Value of parameter written too high.'
  },
  {
    Index: '06090032',
    Name: 'Value of parameter written too low.'
  },
  {
    Index: '06090036',
    Name: 'Maximum value is less than minimum value.'
  },
  {
    Index: '08000000',
    Name: 'General error.'
  },
  {
    Index: '08000020',
    Name: 'Data cannot be transferred or stored to the application.'
  },
  {
    Index: '08000021',
    Name: 'Data cannot be transferred or stored to the application because of local control.'
  },
  {
    Index: '08000022',
    Name: 'Data cannot be transferred or stored to the application because of the present device state.'
  },
  {
    Index: '08000023',
    Name: 'Object dictionary dynamic generation fails or no object dictionary is present (e.g. object dictionary is generated from file and generation fails because of a file error).'
  },
  {
    Index: 'default',
    Name: 'Unknown Abort Code'
  }
]
