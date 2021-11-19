
/**
 *  第三方模板
 */
function getData_PD_TEMPLATE() {
  let PD_TEMPLATE = {

    "floors": [{
      "moduleType": "PD_TEMPLATE",
      "uid": "100382101612323",
      "moduleId": 100382,
      "dsConfig": {
        "children": [{
          "containerType": "text",
          "prefixRefer": "",
          "style": {
            "fontSize": "16",
            "height": "20",
            "isPointDisplay": true,
            "isPointHide": false,
            "lines": 1,
            "marginLeft": "10",
            "marginTop": "10",
            "orientation": "vertical",
            "scroll": 0,
            "scrollBar": 0,
            "scrollBounce": 0,
            "visible": "$showJSysTitle",
            "width": "-1"
          },
          "suffixRefer": "",
          "valueRefer": "$title"
        }, {
          "containerType": "grid",
          "foreach": {
            "arrayName": "$skuList",
            "endIndex": 5,
            "startIndex": 0,
            "template": {
              "children": [{
                "children": [{
                  "children": [{
                    "containerType": "image",
                    "style": {
                      "height": "144",
                      "isCircle": false,
                      "isPointDisplay": true,
                      "isPointHide": false,
                      "marginTop": "3",
                      "orientation": "vertical",
                      "scroll": 0,
                      "scrollBar": 0,
                      "scrollBounce": 0,
                      "width": "143"
                    },
                    "urlRefer": "$skuList.[?].imageUrl"
                  }],
                  "containerType": "container",
                  "style": {
                    "height": "144",
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "orientation": "vertical",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "width": "143"
                  }
                }, {
                  "children": [{
                    "containerType": "text",
                    "prefixRefer": "",
                    "style": {
                      "height": "36",
                      "isPointDisplay": true,
                      "isPointHide": false,
                      "lines": 2,
                      "marginLeft": "10",
                      "marginTop": "8",
                      "orientation": "vertical",
                      "scroll": 0,
                      "scrollBar": 0,
                      "scrollBounce": 0,
                      "width": "130"
                    },
                    "suffixRefer": "",
                    "valueRefer": "$skuList.[?].skuName"
                  }, {
                    "containerType": "text",
                    "prefixRefer": "",
                    "style": {
                      "fontSize": "15",
                      "height": "23",
                      "isPointDisplay": true,
                      "isPointHide": false,
                      "lines": 1,
                      "marginLeft": "10",
                      "orientation": "vertical",
                      "scroll": 0,
                      "scrollBar": 0,
                      "scrollBounce": 0,
                      "textColor": "#f15353",
                      "width": "130"
                    },
                    "suffixRefer": "",
                    "valueRefer": "$skuList.[?].price"
                  }],
                  "containerType": "container",
                  "style": {
                    "height": "200",
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "orientation": "vertical",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "width": "143"
                  }
                }],
                "containerType": "container",
                "style": {
                  "borderColor": "#d9d9d9",
                  "borderWidth": "1",
                  "height": "215",
                  "isPointDisplay": true,
                  "isPointHide": false,
                  "layout": "linear",
                  "marginLeft": "10",
                  "orientation": "vertical",
                  "scroll": 0,
                  "scrollBar": 0,
                  "scrollBounce": 0,
                  "width": "145"
                }
              }],
              "containerType": "container",
              "events": [{
                "actions": [{
                  "break": false,
                  "params": [{
                    "paramName": "跳转sku",
                    "paramType": "",
                    "paramValue": "$skuList.[?].skuId"
                  }],
                  "type": "openURL"
                }],
                "type": "click"
              }],
              "skuNode": {
                "name": "$skuList.[?].skuId"
              },
              "style": {
                "height": "226",
                "isPointDisplay": true,
                "isPointHide": false,
                "orientation": "vertical",
                "scroll": 0,
                "scrollBar": 0,
                "scrollBounce": 0,
                "width": "160"
              }
            }
          },
          "style": {
            "column": 2,
            "height": "-2",
            "isPointDisplay": true,
            "isPointHide": false,
            "marginTop": "10",
            "orientation": "vertical",
            "scroll": 0,
            "scrollBar": 0,
            "scrollBounce": 0,
            "width": "310"
          }
        }, {
          "children": [{
            "containerType": "text",
            "events": [{
              "actions": [{
                "break": false,
                "params": [{
                  "paramName": "页面跳转",
                  "paramType": "*JUMP_SUPER_SKU_PAGE",
                  "paramValue": "$skuList"
                }],
                "type": "openURL"
              }],
              "type": "click"
            }],
            "prefixRefer": "",
            "style": {
              "fontSize": "15",
              "height": "38",
              "isPointDisplay": true,
              "isPointHide": false,
              "lines": 1,
              "marginLeft": "260",
              "marginTop": "8",
              "orientation": "vertical",
              "scroll": 0,
              "scrollBar": 0,
              "scrollBounce": 0,
              "width": "-1"
            },
            "suffixRefer": "",
            "valueRefer": "更多"
          }, {
            "containerType": "image",
            "events": [{
              "actions": [{
                "break": false,
                "params": [{
                  "paramName": "页面跳转",
                  "paramType": "*JUMP_SUPER_SKU_PAGE",
                  "paramValue": "$skuList"
                }],
                "type": "openURL"
              }],
              "type": "click"
            }],
            "style": {
              "height": "16",
              "isCircle": false,
              "isPointDisplay": true,
              "isPointHide": false,
              "marginLeft": "295",
              "marginTop": "9",
              "orientation": "vertical",
              "scroll": 0,
              "scrollBar": 0,
              "scrollBounce": 0,
              "width": "16"
            },
            "urlRefer": "//img10.360buyimg.com/zx/jfs/t11311/250/2340877142/3136/47cbce2f/5a1636e8Na9f8aade.png"
          }],
          "conditions": [{
            "left": "$skuList._size_",
            "right": "6",
            "style": {
              "visible": true
            },
            "type": ">"
          }],
          "containerType": "container",
          "style": {
            "height": "38",
            "isPointDisplay": true,
            "isPointHide": false,
            "layout": "absolute",
            "orientation": "vertical",
            "scroll": 0,
            "scrollBar": 0,
            "scrollBounce": 0,
            "visible": false,
            "width": "-1"
          }
        }],
        "containerType": "container",
        "editProperty": {
          "dataDefines": [{
            "name": "showJSysTitle",
            "nodeText": {
              "dataSourceType": 0,
              "text": "true"
            },
            "propertyName": "是否显示楼层名称",
            "type": "text"
          }, {
            "name": "title",
            "nodeText": {
              "dataSourceType": 0,
              "text": "超值单品"
            },
            "propertyName": "楼层名称",
            "type": "text"
          }, {
            "max": 50,
            "name": "skuList",
            "nodeText": {
              "data": [{
                "price": "￥699.00",
                "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t17632/253/293029255/214032/25f2f41d/5a697bc9N3f7e2acb.jpg.webp",
                "skuId": "25363416688",
                "skuName": "测试商品，请勿下单（时尚领导测试专用-预告价，1月30日-3月15日，勿动） 深红色 XS(155)"
              }, {
                "price": "￥5.00",
                "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t16060/79/1693077440/198427/cf943de9/5a5ef673Nb98e9de5.jpg.webp",
                "skuId": "25150260260",
                "skuName": "【预售标识专用SKU，勿动！】003"
              }, {
                "price": "￥111.00",
                "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t15967/64/1471746897/68541/bc91d5e6/5a531779N3038333f.jpg.webp",
                "skuId": "24149533234",
                "skuName": "令牌价内部测试商品，用户请勿下单购买！！ 蓝色"
              }, {
                "price": "￥111.00",
                "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t15967/64/1471746897/68541/bc91d5e6/5a531779N3038333f.jpg.webp",
                "skuId": "24149533233",
                "skuName": "令牌价内部测试商品，用户请勿下单购买！！ 浅黄色"
              }],
              "key": "100382101612323"
            },
            "propertyName": "配置商品",
            "type": "sku"
          }]
        },
        "style": {
          "height": "-2",
          "isPointDisplay": true,
          "isPointHide": false,
          "orientation": "vertical",
          "scroll": 0,
          "scrollBar": 0,
          "scrollBounce": 0,
          "width": "-1"
        }
      },
      "decorationType": 1,
      "tempDecorationType": 24,
      "floorIdx": 0,
      "menuType": 0,
      "scv": "6.6.1",
      "wareInfoList": [{
        "wareId": "25363416688",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t17632/253/293029255/214032/25f2f41d/5a697bc9N3f7e2acb.jpg.webp",
        "wareName": "测试商品，请勿下单（时尚领导测试专用-预告价，1月30日-3月15日，勿动） 深红色 XS(155)",
        "jdPrice": "699.00",
        "mPrice": "1200.00",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "25150260260",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t16060/79/1693077440/198427/cf943de9/5a5ef673Nb98e9de5.jpg.webp",
        "wareName": "【预售标识专用SKU，勿动！】003",
        "jdPrice": "5.00",
        "mPrice": "30.00",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "24149533234",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t15967/64/1471746897/68541/bc91d5e6/5a531779N3038333f.jpg.webp",
        "wareName": "令牌价内部测试商品，用户请勿下单购买！！ 蓝色",
        "jdPrice": "111.00",
        "mPrice": "111.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "24149533233",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t15967/64/1471746897/68541/bc91d5e6/5a531779N3038333f.jpg.webp",
        "wareName": "令牌价内部测试商品，用户请勿下单购买！！ 浅黄色",
        "jdPrice": "111.00",
        "mPrice": "111.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }]
    }, {
      "moduleType": "PD_TEMPLATE",
      "uid": "81728628193082",
      "moduleId": 81728,
      "dsConfig": {
        "children": [{
          "children": [{
            "containerType": "text",
            "prefixRefer": "",
            "style": {
              "fontSize": "15",
              "fontWeight": 500,
              "gravity": 5,
              "height": "30",
              "isPointDisplay": true,
              "isPointHide": false,
              "lines": 1,
              "orientation": "vertical",
              "scroll": 0,
              "scrollBar": 0,
              "scrollBounce": 0,
              "width": "320"
            },
            "suffixRefer": "",
            "valueRefer": "猜你喜欢"
          }],
          "containerType": "container",
          "style": {
            "height": "30",
            "isPointDisplay": true,
            "isPointHide": false,
            "orientation": "vertical",
            "scroll": 0,
            "scrollBar": 0,
            "scrollBounce": 0,
            "width": "320"
          }
        }, {
          "containerType": "grid",
          "editProperty": {
            "dataDefines": [{
              "hasTopSku": false,
              "max": 6,
              "name": "grid_array",
              "propertyName": "智慧选品配置",
              "type": "sku",
              "nodeText": {
                "data": [{
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t9019/358/421876781/415228/bc177154/59a7b30dNad8ac2c8.png.webp",
                  "price": "￥4998.00",
                  "skuId": "16097285885",
                  "skuName": "【定制测试商品】测试定制商品，请勿下单，下单不发货（定制后台优化测试期间请勿下架)"
                }, {
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t11767/326/121900116/415228/bc177154/59e81075Nd3f2e622.png.webp",
                  "price": "￥1000.00",
                  "skuId": "18378469458",
                  "skuName": "测试商品，请勿下单！"
                }, {
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t9223/24/1864373694/134298/29287106/59c0c23cNaac6ef6e.jpg.webp",
                  "price": "￥3999.00",
                  "skuId": "16876681576",
                  "skuName": "测试商品，请勿下单（主图测试） 红色 默认1"
                }, {
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t11785/206/686945/154232/238e1d/59e571ebN3409925f.png.webp",
                  "price": "￥0.10",
                  "skuId": "18169696062",
                  "skuName": "wq测试商品到店服务！！！ 测试"
                }, {
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t7972/190/2491051149/415228/bc177154/59afd529N5660db03.png.webp",
                  "price": "￥0.01",
                  "skuId": "16546641263",
                  "skuName": "testtest1 灯具 红色 默认1"
                }],
                "max": 6,
                "dataSourceType": 0
              }
            }]
          },
          "foreach": {
            "arrayName": "$grid_array",
            "template": {
              "children": [{
                "children": [{
                  "containerType": "image",
                  "style": {
                    "height": "98",
                    "isCircle": false,
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "orientation": "vertical",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "width": "-1"
                  },
                  "urlRefer": "$grid_array.[?].imageUrl"
                }, {
                  "containerType": "line",
                  "style": {
                    "color": "#E0E1E6",
                    "gap": 0,
                    "height": "1",
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "orientation": "horizontal",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "width": "-1"
                  }
                }, {
                  "containerType": "text",
                  "prefixRefer": "",
                  "style": {
                    "fontSize": "12",
                    "gravity": 0,
                    "height": "15",
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "lines": 1,
                    "marginLeft": "4",
                    "marginTop": "3",
                    "orientation": "vertical",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "textColor": "#4F4F4F",
                    "width": "88"
                  },
                  "suffixRefer": "",
                  "valueRefer": "$grid_array.[?].skuName"
                }, {
                  "containerType": "text",
                  "prefixRefer": "",
                  "style": {
                    "fontSize": "14",
                    "gravity": 0,
                    "height": "-1",
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "lines": 1,
                    "marginLeft": "2",
                    "marginTop": "5",
                    "orientation": "vertical",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "textColor": "#343434",
                    "width": "92"
                  },
                  "suffixRefer": "",
                  "valueRefer": "$grid_array.[?].price"
                }],
                "containerType": "container",
                "style": {
                  "backgroundColor": "#ffffff",
                  "height": "148",
                  "isPointDisplay": true,
                  "isPointHide": false,
                  "marginTop": "12",
                  "orientation": "vertical",
                  "scroll": 0,
                  "scrollBar": 0,
                  "scrollBounce": 0,
                  "width": "-1"
                }
              }],
              "containerType": "container",
              "events": [{
                "actions": [{
                  "break": false,
                  "params": [{
                    "paramName": "跳转sku",
                    "paramType": "",
                    "paramValue": "$grid_array.[?].skuId"
                  }],
                  "type": "openURL"
                }],
                "type": "click"
              }],
              "skuNode": {
                "name": "$grid_array.[?].skuId"
              },
              "style": {
                "backgroundColor": "#E0E1E6",
                "height": "157",
                "isPointDisplay": true,
                "isPointHide": false,
                "orientation": "vertical",
                "paddingLeft": "3",
                "paddingRight": "3",
                "scroll": 0,
                "scrollBar": 0,
                "scrollBounce": 0,
                "width": "-1"
              }
            }
          },
          "style": {
            "column": 3,
            "height": "315",
            "isPointDisplay": true,
            "isPointHide": false,
            "orientation": "vertical",
            "paddingLeft": "3",
            "paddingRight": "3",
            "scroll": 0,
            "scrollBar": 0,
            "scrollBounce": 0,
            "width": "320"
          },
          "empty": false
        }],
        "containerType": "container",
        "style": {
          "backgroundColor": "#E0E1E6",
          "height": "353",
          "isPointDisplay": true,
          "isPointHide": false,
          "orientation": "vertical",
          "scroll": 0,
          "scrollBar": 0,
          "scrollBounce": 0,
          "width": "-1"
        }
      },
      "decorationType": 1,
      "tempDecorationType": 2,
      "floorIdx": 1,
      "menuType": 0,
      "scv": "6.5.0",
      "wareInfoList": [{
        "wareId": "16097285885",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t9019/358/421876781/415228/bc177154/59a7b30dNad8ac2c8.png.webp",
        "wareName": "【定制测试商品】测试定制商品，请勿下单，下单不发货（定制后台优化测试期间请勿下架)",
        "jdPrice": "4998.00",
        "mPrice": "5555.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "18378469458",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t11767/326/121900116/415228/bc177154/59e81075Nd3f2e622.png.webp",
        "wareName": "测试商品，请勿下单！",
        "jdPrice": "1000.00",
        "mPrice": "1000.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "16876681576",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t9223/24/1864373694/134298/29287106/59c0c23cNaac6ef6e.jpg.webp",
        "wareName": "测试商品，请勿下单（主图测试） 红色 默认1",
        "jdPrice": "3999.00",
        "mPrice": "29999.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "18169696062",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t11785/206/686945/154232/238e1d/59e571ebN3409925f.png.webp",
        "wareName": "wq测试商品到店服务！！！ 测试",
        "jdPrice": "0.10",
        "mPrice": "2.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "16546641263",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t7972/190/2491051149/415228/bc177154/59afd529N5660db03.png.webp",
        "wareName": "testtest1 灯具 红色 默认1",
        "jdPrice": "0.01",
        "mPrice": "0.01",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }]
    }, {
      "moduleType": "PD_TEMPLATE",
      "uid": "996531149921033",
      "moduleId": 99653,
      "dsConfig": {
        "containerType": "slider",
        "editProperty": {
          "dataDefines": [{
            "height": 390,
            "max": 10,
            "name": "slide_array",
            "nodeText": {
              "data": [{
                "detail": {
                  "configDataType": 0,
                  "configDataValue": "",
                  "key": "381901107623941"
                },
                "imageUrl": "//img12.360buyimg.com/zx/jfs/t11194/264/1458672957/47161/fffc3dee/5a012a2fN46685370.png",
                "key": "381901107623941"
              }, {
                "detail": {
                  "configDataType": 0,
                  "configDataValue": "",
                  "key": "381901107623942"
                },
                "imageUrl": "//img12.360buyimg.com/zx/jfs/t11194/264/1458672957/47161/fffc3dee/5a012a2fN46685370.png",
                "key": "381901107623942"
              }],
              "dataSourceType": 2
            },
            "propertyName": "轮播图配置",
            "type": "jsonArray",
            "width": 960
          }]
        },
        "foreach": {
          "arrayName": "$slide_array",
          "template": {
            "containerType": "image",
            "events": [{
              "actions": [{
                "break": false,
                "params": [{
                  "paramName": "跳转sku",
                  "paramType": "",
                  "paramValue": "$slide_array.[?].detail"
                }],
                "type": "openURL"
              }],
              "type": "click"
            }],
            "style": {
              "height": "-1",
              "isCircle": false,
              "isPointDisplay": true,
              "isPointHide": false,
              "orientation": "vertical",
              "scroll": 0,
              "scrollBar": 0,
              "scrollBounce": 0,
              "width": "-1"
            },
            "urlRefer": "$slide_array.[?].imageUrl"
          }
        },
        "style": {
          "backgroundColor": "#FFFFFF",
          "height": "130",
          "isPointDisplay": true,
          "isPointHide": false,
          "orientation": "vertical",
          "scroll": 0,
          "scrollBar": 0,
          "scrollBounce": 0,
          "width": "320"
        }
      },
      "decorationType": 1,
      "tempDecorationType": 5,
      "floorIdx": 2,
      "menuType": 0,
      "scv": "6.6.0",
      "skuList": []
    }, {
      "moduleType": "PD_TEMPLATE",
      "uid": "81728457586889",
      "moduleId": 81728,
      "dsConfig": {
        "children": [{
          "children": [{
            "containerType": "text",
            "prefixRefer": "",
            "style": {
              "fontSize": "15",
              "fontWeight": 500,
              "gravity": 5,
              "height": "30",
              "isPointDisplay": true,
              "isPointHide": false,
              "lines": 1,
              "orientation": "vertical",
              "scroll": 0,
              "scrollBar": 0,
              "scrollBounce": 0,
              "width": "320"
            },
            "suffixRefer": "",
            "valueRefer": "猜你喜欢"
          }],
          "containerType": "container",
          "style": {
            "height": "30",
            "isPointDisplay": true,
            "isPointHide": false,
            "orientation": "vertical",
            "scroll": 0,
            "scrollBar": 0,
            "scrollBounce": 0,
            "width": "320"
          }
        }, {
          "containerType": "grid",
          "editProperty": {
            "dataDefines": [{
              "hasTopSku": false,
              "max": 6,
              "name": "grid_array",
              "propertyName": "智慧选品配置",
              "type": "sku",
              "nodeText": {
                "data": [{
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t9019/358/421876781/415228/bc177154/59a7b30dNad8ac2c8.png.webp",
                  "price": "￥4998.00",
                  "skuId": "16097285885",
                  "skuName": "【定制测试商品】测试定制商品，请勿下单，下单不发货（定制后台优化测试期间请勿下架)"
                }, {
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t11767/326/121900116/415228/bc177154/59e81075Nd3f2e622.png.webp",
                  "price": "￥1000.00",
                  "skuId": "18378469458",
                  "skuName": "测试商品，请勿下单！"
                }, {
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t9223/24/1864373694/134298/29287106/59c0c23cNaac6ef6e.jpg.webp",
                  "price": "￥3999.00",
                  "skuId": "16876681576",
                  "skuName": "测试商品，请勿下单（主图测试） 红色 默认1"
                }, {
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t11785/206/686945/154232/238e1d/59e571ebN3409925f.png.webp",
                  "price": "￥0.10",
                  "skuId": "18169696062",
                  "skuName": "wq测试商品到店服务！！！ 测试"
                }, {
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t7972/190/2491051149/415228/bc177154/59afd529N5660db03.png.webp",
                  "price": "￥0.01",
                  "skuId": "16546641263",
                  "skuName": "testtest1 灯具 红色 默认1"
                }],
                "max": 6,
                "dataSourceType": 0
              }
            }]
          },
          "foreach": {
            "arrayName": "$grid_array",
            "template": {
              "children": [{
                "children": [{
                  "containerType": "image",
                  "style": {
                    "height": "98",
                    "isCircle": false,
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "orientation": "vertical",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "width": "-1"
                  },
                  "urlRefer": "$grid_array.[?].imageUrl"
                }, {
                  "containerType": "line",
                  "style": {
                    "color": "#E0E1E6",
                    "gap": 0,
                    "height": "1",
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "orientation": "horizontal",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "width": "-1"
                  }
                }, {
                  "containerType": "text",
                  "prefixRefer": "",
                  "style": {
                    "fontSize": "12",
                    "gravity": 0,
                    "height": "15",
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "lines": 1,
                    "marginLeft": "4",
                    "marginTop": "3",
                    "orientation": "vertical",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "textColor": "#4F4F4F",
                    "width": "88"
                  },
                  "suffixRefer": "",
                  "valueRefer": "$grid_array.[?].skuName"
                }, {
                  "containerType": "text",
                  "prefixRefer": "",
                  "style": {
                    "fontSize": "14",
                    "gravity": 0,
                    "height": "-1",
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "lines": 1,
                    "marginLeft": "2",
                    "marginTop": "5",
                    "orientation": "vertical",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "textColor": "#343434",
                    "width": "92"
                  },
                  "suffixRefer": "",
                  "valueRefer": "$grid_array.[?].price"
                }],
                "containerType": "container",
                "style": {
                  "backgroundColor": "#ffffff",
                  "height": "148",
                  "isPointDisplay": true,
                  "isPointHide": false,
                  "marginTop": "12",
                  "orientation": "vertical",
                  "scroll": 0,
                  "scrollBar": 0,
                  "scrollBounce": 0,
                  "width": "-1"
                }
              }],
              "containerType": "container",
              "events": [{
                "actions": [{
                  "break": false,
                  "params": [{
                    "paramName": "跳转sku",
                    "paramType": "",
                    "paramValue": "$grid_array.[?].skuId"
                  }],
                  "type": "openURL"
                }],
                "type": "click"
              }],
              "skuNode": {
                "name": "$grid_array.[?].skuId"
              },
              "style": {
                "backgroundColor": "#E0E1E6",
                "height": "157",
                "isPointDisplay": true,
                "isPointHide": false,
                "orientation": "vertical",
                "paddingLeft": "3",
                "paddingRight": "3",
                "scroll": 0,
                "scrollBar": 0,
                "scrollBounce": 0,
                "width": "-1"
              }
            }
          },
          "style": {
            "column": 3,
            "height": "315",
            "isPointDisplay": true,
            "isPointHide": false,
            "orientation": "vertical",
            "paddingLeft": "3",
            "paddingRight": "3",
            "scroll": 0,
            "scrollBar": 0,
            "scrollBounce": 0,
            "width": "320"
          },
          "empty": false
        }],
        "containerType": "container",
        "style": {
          "backgroundColor": "#E0E1E6",
          "height": "353",
          "isPointDisplay": true,
          "isPointHide": false,
          "orientation": "vertical",
          "scroll": 0,
          "scrollBar": 0,
          "scrollBounce": 0,
          "width": "-1"
        }
      },
      "decorationType": 1,
      "tempDecorationType": 2,
      "floorIdx": 3,
      "menuType": 0,
      "scv": "6.5.0",
      "wareInfoList": [{
        "wareId": "16097285885",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t9019/358/421876781/415228/bc177154/59a7b30dNad8ac2c8.png.webp",
        "wareName": "【定制测试商品】测试定制商品，请勿下单，下单不发货（定制后台优化测试期间请勿下架)",
        "jdPrice": "4998.00",
        "mPrice": "5555.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "18378469458",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t11767/326/121900116/415228/bc177154/59e81075Nd3f2e622.png.webp",
        "wareName": "测试商品，请勿下单！",
        "jdPrice": "1000.00",
        "mPrice": "1000.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "16876681576",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t9223/24/1864373694/134298/29287106/59c0c23cNaac6ef6e.jpg.webp",
        "wareName": "测试商品，请勿下单（主图测试） 红色 默认1",
        "jdPrice": "3999.00",
        "mPrice": "29999.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "18169696062",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t11785/206/686945/154232/238e1d/59e571ebN3409925f.png.webp",
        "wareName": "wq测试商品到店服务！！！ 测试",
        "jdPrice": "0.10",
        "mPrice": "2.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "16546641263",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t7972/190/2491051149/415228/bc177154/59afd529N5660db03.png.webp",
        "wareName": "testtest1 灯具 红色 默认1",
        "jdPrice": "0.01",
        "mPrice": "0.01",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }]
    }, {
      "moduleType": "PD_TEMPLATE",
      "uid": "817281008115816",
      "moduleId": 81728,
      "dsConfig": {
        "children": [{
          "children": [{
            "containerType": "text",
            "prefixRefer": "",
            "style": {
              "fontSize": "15",
              "fontWeight": 500,
              "gravity": 5,
              "height": "30",
              "isPointDisplay": true,
              "isPointHide": false,
              "lines": 1,
              "orientation": "vertical",
              "scroll": 0,
              "scrollBar": 0,
              "scrollBounce": 0,
              "width": "320"
            },
            "suffixRefer": "",
            "valueRefer": "猜你喜欢"
          }],
          "containerType": "container",
          "style": {
            "height": "30",
            "isPointDisplay": true,
            "isPointHide": false,
            "orientation": "vertical",
            "scroll": 0,
            "scrollBar": 0,
            "scrollBounce": 0,
            "width": "320"
          }
        }, {
          "containerType": "grid",
          "editProperty": {
            "dataDefines": [{
              "hasTopSku": false,
              "max": 6,
              "name": "grid_array",
              "propertyName": "智慧选品配置",
              "type": "sku",
              "nodeText": {
                "data": [{
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t9019/358/421876781/415228/bc177154/59a7b30dNad8ac2c8.png.webp",
                  "price": "￥4998.00",
                  "skuId": "16097285885",
                  "skuName": "【定制测试商品】测试定制商品，请勿下单，下单不发货（定制后台优化测试期间请勿下架)"
                }, {
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t11767/326/121900116/415228/bc177154/59e81075Nd3f2e622.png.webp",
                  "price": "￥1000.00",
                  "skuId": "18378469458",
                  "skuName": "测试商品，请勿下单！"
                }, {
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t9223/24/1864373694/134298/29287106/59c0c23cNaac6ef6e.jpg.webp",
                  "price": "￥3999.00",
                  "skuId": "16876681576",
                  "skuName": "测试商品，请勿下单（主图测试） 红色 默认1"
                }, {
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t11785/206/686945/154232/238e1d/59e571ebN3409925f.png.webp",
                  "price": "￥0.10",
                  "skuId": "18169696062",
                  "skuName": "wq测试商品到店服务！！！ 测试"
                }, {
                  "imageUrl": "//m.360buyimg.com/n1/s495x495_jfs/t7972/190/2491051149/415228/bc177154/59afd529N5660db03.png.webp",
                  "price": "￥0.01",
                  "skuId": "16546641263",
                  "skuName": "testtest1 灯具 红色 默认1"
                }],
                "max": 6,
                "dataSourceType": 0
              }
            }]
          },
          "foreach": {
            "arrayName": "$grid_array",
            "template": {
              "children": [{
                "children": [{
                  "containerType": "image",
                  "style": {
                    "height": "98",
                    "isCircle": false,
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "orientation": "vertical",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "width": "-1"
                  },
                  "urlRefer": "$grid_array.[?].imageUrl"
                }, {
                  "containerType": "line",
                  "style": {
                    "color": "#E0E1E6",
                    "gap": 0,
                    "height": "1",
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "orientation": "horizontal",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "width": "-1"
                  }
                }, {
                  "containerType": "text",
                  "prefixRefer": "",
                  "style": {
                    "fontSize": "12",
                    "gravity": 0,
                    "height": "15",
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "lines": 1,
                    "marginLeft": "4",
                    "marginTop": "3",
                    "orientation": "vertical",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "textColor": "#4F4F4F",
                    "width": "88"
                  },
                  "suffixRefer": "",
                  "valueRefer": "$grid_array.[?].skuName"
                }, {
                  "containerType": "text",
                  "prefixRefer": "",
                  "style": {
                    "fontSize": "14",
                    "gravity": 0,
                    "height": "-1",
                    "isPointDisplay": true,
                    "isPointHide": false,
                    "lines": 1,
                    "marginLeft": "2",
                    "marginTop": "5",
                    "orientation": "vertical",
                    "scroll": 0,
                    "scrollBar": 0,
                    "scrollBounce": 0,
                    "textColor": "#343434",
                    "width": "92"
                  },
                  "suffixRefer": "",
                  "valueRefer": "$grid_array.[?].price"
                }],
                "containerType": "container",
                "style": {
                  "backgroundColor": "#ffffff",
                  "height": "148",
                  "isPointDisplay": true,
                  "isPointHide": false,
                  "marginTop": "12",
                  "orientation": "vertical",
                  "scroll": 0,
                  "scrollBar": 0,
                  "scrollBounce": 0,
                  "width": "-1"
                }
              }],
              "containerType": "container",
              "events": [{
                "actions": [{
                  "break": false,
                  "params": [{
                    "paramName": "跳转sku",
                    "paramType": "",
                    "paramValue": "$grid_array.[?].skuId"
                  }],
                  "type": "openURL"
                }],
                "type": "click"
              }],
              "skuNode": {
                "name": "$grid_array.[?].skuId"
              },
              "style": {
                "backgroundColor": "#E0E1E6",
                "height": "157",
                "isPointDisplay": true,
                "isPointHide": false,
                "orientation": "vertical",
                "paddingLeft": "3",
                "paddingRight": "3",
                "scroll": 0,
                "scrollBar": 0,
                "scrollBounce": 0,
                "width": "-1"
              }
            }
          },
          "style": {
            "column": 3,
            "height": "315",
            "isPointDisplay": true,
            "isPointHide": false,
            "orientation": "vertical",
            "paddingLeft": "3",
            "paddingRight": "3",
            "scroll": 0,
            "scrollBar": 0,
            "scrollBounce": 0,
            "width": "320"
          },
          "empty": false
        }],
        "containerType": "container",
        "style": {
          "backgroundColor": "#E0E1E6",
          "height": "353",
          "isPointDisplay": true,
          "isPointHide": false,
          "orientation": "vertical",
          "scroll": 0,
          "scrollBar": 0,
          "scrollBounce": 0,
          "width": "-1"
        }
      },
      "decorationType": 1,
      "tempDecorationType": 2,
      "floorIdx": 4,
      "menuType": 0,
      "scv": "6.5.0",
      "wareInfoList": [{
        "wareId": "16097285885",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t9019/358/421876781/415228/bc177154/59a7b30dNad8ac2c8.png.webp",
        "wareName": "【定制测试商品】测试定制商品，请勿下单，下单不发货（定制后台优化测试期间请勿下架)",
        "jdPrice": "4998.00",
        "mPrice": "5555.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "18378469458",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t11767/326/121900116/415228/bc177154/59e81075Nd3f2e622.png.webp",
        "wareName": "测试商品，请勿下单！",
        "jdPrice": "1000.00",
        "mPrice": "1000.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "16876681576",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t9223/24/1864373694/134298/29287106/59c0c23cNaac6ef6e.jpg.webp",
        "wareName": "测试商品，请勿下单（主图测试） 红色 默认1",
        "jdPrice": "3999.00",
        "mPrice": "29999.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "18169696062",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t11785/206/686945/154232/238e1d/59e571ebN3409925f.png.webp",
        "wareName": "wq测试商品到店服务！！！ 测试",
        "jdPrice": "0.10",
        "mPrice": "2.00",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }, {
        "wareId": "16546641263",
        "stock": -1,
        "isUnderCarriage": 0,
        "imgPath": "https://m.360buyimg.com/n1/s495x495_jfs/t7972/190/2491051149/415228/bc177154/59afd529N5660db03.png.webp",
        "wareName": "testtest1 灯具 红色 默认1",
        "jdPrice": "0.01",
        "mPrice": "0.01",
        "promFlag": 1,
        "promName": "会员特价",
        "flashSale": 0,
        "isPreSale": false,
        "addCart": false,
        "jdDeliver": false
      }]
    }, {
      "moduleType": "PD_MENU",
      "uid": "11",
      "moduleId": 81,
      "templateId": 92,
      "dsConfig": {
        "venderId": 134766,
        "shopId": 130496,
        "configs": [{
          "menuid": 0,
          "menuName": "店铺会员",
          "configs": {
            "configType": 9,
            "needLogin": false
          }
        }, {
          "menuid": 0,
          "menuName": "店铺详情",
          "configs": {
            "configType": 6,
            "toShopDetail": true,
            "needLogin": false
          }
        }, {
          "menuid": 0,
          "menuName": "热门分类",
          "subMenu": [{
            "menuid": 0,
            "menuName": "8798、",
            "configs": {
              "cid": "7135679",
              "configType": 3,
              "needLogin": false
            }
          }, {
            "menuid": 0,
            "menuName": "111",
            "configs": {
              "cid": "7134722",
              "configType": 3,
              "needLogin": false
            }
          }, {
            "menuid": 0,
            "menuName": "1",
            "configs": {
              "cid": "7050793",
              "configType": 3,
              "needLogin": false
            }
          }, {
            "menuid": 0,
            "menuName": "3",
            "configs": {
              "cid": "7050797",
              "configType": 3,
              "needLogin": false
            }
          }]
        }, {
          "menuid": 0,
          "menuName": "联系卖家",
          "configs": {
            "configType": 7,
            "imtype": "2",
            "checkChat": {
              "code": 1,
              "chatDomain": "chat.jd.com",
              "rank3": 0,
              "seller": "测试店铺sop1",
              "shopId": 130496,
              "venderId": 134766
            },
            "needLogin": false
          }
        }],
        "needLogin": false
      },
      "decorationType": 0,
      "floorIdx": 0,
      "menuType": 0
    }],
   

  }

  return PD_TEMPLATE.floors;

}

  module.exports = {
    getData_PD_TEMPLATE: getData_PD_TEMPLATE,
  };



  

