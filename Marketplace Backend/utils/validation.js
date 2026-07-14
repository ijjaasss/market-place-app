export function isValid(...value){
      for(let i=0;i<value.length;i++){
        if(!value[i]){
            return false
        }
      }
      return true
}