/**
 * [清除掉首尾空格]
 */
export function trim(text) {
	if(text) {
		text = text + ''
		return text.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '')
	} else {
		return ''
	}
}
//验证手机号码
export function isPhoneValid (phone) {
    if ((/^[1-9]\d*|0$/.test(phone))) {
      return true
    }else{
      return false
    }
  }
/**
 * [清除掉所有空格]
 */
  export function removeAllSpace(str) {
    if(str){
      return str.replace(/\s+/g, "");
    }else {
      return ''
    }
   }