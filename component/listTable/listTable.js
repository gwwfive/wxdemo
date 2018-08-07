// component/listTable/listTable.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: { // 属性名
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    state: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    flag:{ // 属性名
    type:String,
    value:'0'

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag:'0'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    preventD:function(){
      console.log('阻止冒泡事件');
    }

  }
})
