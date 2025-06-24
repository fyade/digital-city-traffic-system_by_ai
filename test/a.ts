class cls1 {
  private static instance: cls1 | null=null
  private name: string | null=null

  constructor(name: string) {
    if (!cls1.instance) {
      this.name = name;
      cls1.instance = this
    }
    return cls1.instance
  }
}


const clsa = new cls1('a');
const clsb = new cls1('b');
console.log(clsa,clsb)
