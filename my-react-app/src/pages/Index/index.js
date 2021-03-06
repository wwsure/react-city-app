import React from 'react'

import { Carousel, Flex, Grid, WingBlank} from 'antd-mobile'

// 导入 axios
import axios from 'axios'

// 导入样式
import './index.scss'

import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
export default class Index extends React.Component {
  state = {
    // 轮播图图片数据
    swipers: [],
    // 设置图片高度
    imgHeight: 212,
    // 表示轮播图是否加载中
    isSwiperLoading: true,
    // 租房小组数据
    groups:[],
    // 最新资讯数据
    news:[]
  }

  // 获取轮播图数据
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')

    // console.log('轮播图数据：', res)
    this.setState({
      swipers: res.data.body,

      // 表示轮播图数据已经加载完成
      isSwiperLoading: false
    })
  }

  // 获取租房小组数据
  async getGroups (){
    const res = await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
    this.setState({
      groups:res.data.body
    })
  }

  // 获取最新消息数据
  async getNews(){
    const res = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    this.setState({
      news:res.data.body
    })
  }

  componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()
  }

  // 渲染轮播图数据
  renderSwipers() {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="http://itcast.cn"
        style={{
          display: 'inline-block',
          width: '100%',
          height: this.state.imgHeight
        }}
      >
        {/* 
          onLoad 图片加载完成时的事件（联想 window.onload）

          每个图片都有一个 onError 事件，在图片加载失败时触发
        */}
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            // fire window resize event to change height
            // 触发 window 的 resize 事件，来改变图片高度
            window.dispatchEvent(new Event('resize'))
            this.setState({ imgHeight: 'auto' })
          }}
        />
      </a>
    ))
  }

  getNew(){
    return this.state.news.map(item => (
      <div className='news-item'>
        <div>
          <img src={`http://localhost:8080${item.imgSrc}`} alt=""/>
        </div>
        <Flex className="content" direction="column" justify="between">
          <h4 className="title">{item.title}</h4>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  render() {
    return (
      <div className="index">
        {/* 当轮播图数据加载的过程中，不渲染轮播图组件；当数据加载完成后，再渲染轮播图组件 */}
        <div className="swiper">

        {this.state.isSwiperLoading ? null : (
            <Carousel autoplay={true} infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          )}
        </div>
          {/*导航*/}
          <Flex className="nav">
            <Flex.Item>
              <img src={nav1} alt=''/>
              <p>整租</p>
            </Flex.Item>
            <Flex.Item>
              <img src={nav2} alt=''/>
              <p>合租</p>
            </Flex.Item> <Flex.Item>
              <img src={nav3} alt=''/>
              <p>地图找房</p>
            </Flex.Item> <Flex.Item>
              <img src={nav4} alt=''/>
              <p>去出租</p>
            </Flex.Item>
          </Flex>

          {/*租房小组*/}
          <div className='group'>
            {/*标题*/}
            <Flex justify='between' className='group-title'>
              <h4>租房小组</h4>
              <span>更多</span>
            </Flex>
            <Grid data={this.state.groups}
              className='grid'
              columnNum={2}
              hasLine={false}
              square={false}
              activeStyle
              renderItem={item => (
              <Flex className="grid-item" justify='between'>
                <div>
                  <p>{item.title}</p>
                  <span>{item.desc}</span>
                </div>
                <div>
                  <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                </div>
              </Flex>
                
              )}
            />
          </div>
          
          {/*最新资讯*/}
          <div className="newestNew">
          <Flex justify='between' className='newestNew-title'>
              <h4>最新资讯</h4>
          </Flex>
              <WingBlank size="md">{this.getNew()}</WingBlank>
          </div>
      </div>
    )
  }
}
