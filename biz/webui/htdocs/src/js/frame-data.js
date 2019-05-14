var React = require('react');
var BtnGroup = require('./btn-group');
var JSONViewer = require('./json-viewer');
var Textarea = require('./textarea');
var MessagepackText = require('./messagepack');
var MessagepackViewer = require('./msgpack-viewer');
var FrameComposer = require('./frame-composer');
var util = require('./util');
var events = require('./events');
var notepack = require('notepack.io');
var msgpack = require('msgpack5')();

var BTNS = [
  { name: 'MessagePack' },
  { name: 'TextView' },
  { name: 'JSONView' },
  { name: 'HexView' },
  { name: 'Composer' }
];

function findActive(btn) {
  return btn.active;
}

function base64MessagePackDecodeToJson(base64) {
  if (base64) {
    const buffer = Buffer.from(base64, 'base64');
    return JSON.stringify(msgpack.decode(buffer));
  }
}

var FrameClient = React.createClass({
  getInitialState: function() {
    return {};
  },
  showTab: function(i) {
    BTNS.forEach(function(btn) {
      btn.active = false;
    });
    this.selectBtn(BTNS[i]);
    this.setState({});
  },
  componentDidMount: function() {
    var self = this;
    events.on('composeFrame', function(e, frame) {
      if (frame) {
        self.showTab(3);
      }
    });
    events.on('showFrameTextView', function() {
      self.showTab(0);
    });
  },
  onClickBtn: function(btn) {
    this.selectBtn(btn);
    this.setState({});
  },
  selectBtn: function(btn) {
    btn.active = true;
    this.state.btn = btn;
  },
  render: function() {
    var state = this.state;
    var btn = state.btn;
    if (BTNS.indexOf(btn) === -1) {
      btn = util.findArray(BTNS, findActive) || BTNS[0];
      this.selectBtn(btn);
    }
    var frame = this.props.frame;
    var text, json, bin, base64;
    // console.log('FD: ', this.props);
    if (frame) {
      text = util.getBody(frame, true);
      bin = util.getHex(frame);
      json = util.getJson(frame, true);
      base64 = frame.base64;
    }
    base64 = base64 || '';
    return (
      <div
        className={
          'fill orient-vertical-box w-frames-data' +
          (this.props.hide ? ' hide' : '')
        }
      >
        <BtnGroup onClick={this.onClickBtn} btns={BTNS} />
        <Textarea
          className="fill"
          base64={base64}
          value={text}
          hide={btn.name !== 'TextView'}
        />
        <JSONViewer data={json} hide={btn.name !== 'JSONView'} />
        <Textarea
          className="fill n-monospace"
          isHexView="1"
          base64={base64}
          value={bin}
          hide={btn.name !== 'HexView'}
        />
        <FrameComposer data={this.props.data} hide={btn.name !== 'Composer'} />
        {/* <JSONViewer
          data={base64MessagePackDecodeToJson(base64)}
          hide={btn.name !== 'MessagePack'}
        /> */}
        <Textarea
          className="fill n-monospace"
          isHexView="1"
          base64={base64MessagePackDecodeToJson(base64)}
          value={base64MessagePackDecodeToJson(base64)}
          hide={btn.name !== 'MessagePack'}
        />
        {/* <MessagepackText
          className="fill"
          base64={base64}
          value={text}
          hide={btn.name !== 'MessagePack'}
        /> */}
        {/* <MessagepackViewer
          data={base64}
          base64={base64}
          hide={btn.name !== 'MessagePack'} */}
        />
      </div>
    );
  }
});

module.exports = FrameClient;
