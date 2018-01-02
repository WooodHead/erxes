import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import {
  Button,
  Icon,
  FormControl,
  ModalTrigger
} from 'modules/common/components';
import { Alert } from 'modules/common/utils';
import {
  FormWrapper,
  InputsWrapper,
  ListWrapper,
  Footer,
  LoadMore,
  TitleSpan
} from '../../styles';

const propTypes = {
  data: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  datas: PropTypes.array.isRequired,
  form: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  renderName: PropTypes.func.isRequired,
  perPage: PropTypes.number.isRequired
};

const contextTypes = {
  closeModal: PropTypes.func.isRequired
};

class CommonAssociate extends React.Component {
  constructor(props) {
    super(props);
    const datas = this.props.data.datas || [];

    this.state = {
      datas,
      loadmore: true,
      searchValue: ''
    };

    this.save = this.save.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  save() {
    const { datas } = this.state;
    const ids = [];

    datas.forEach(data => {
      ids.push(data._id.toString());
    });

    this.props.save(ids);
    this.context.closeModal();
  }

  componentWillUnmount() {
    this.props.search('');
  }

  componentWillReceiveProps(newProps) {
    const { datas, perPage } = newProps;

    this.setState({ loadmore: datas.length === perPage });
  }

  handleChange(e, data) {
    const { datas } = this.state;
    const type = e.target.getAttribute('icon');

    if (type === 'plus') {
      if (datas.some(item => item._id === data._id))
        return Alert.warning('Already added');
      this.setState({
        datas: [...datas, data]
      });
    } else {
      this.setState({
        datas: datas.filter(item => item !== data)
      });
    }
  }

  search(e) {
    if (this.timer) clearTimeout(this.timer);
    const { search } = this.props;
    const value = e.target.value;

    this.timer = setTimeout(() => {
      search(value);
      this.setState({ searchValue: value });
    }, 500);
  }

  loadMore() {
    this.setState({ loadmore: false });
    this.props.search(this.state.searchValue, true);
  }

  renderRow(data, icon) {
    return (
      <li key={data._id}>
        <Icon icon={icon} onClick={e => this.handleChange(e, data)} />
        {this.props.renderName(data)}
      </li>
    );
  }

  render() {
    const { datas, form, title, data } = this.props;

    const addTrigger = (
      <span>
        Don&apos;t see the result you&apos;re looking for? &ensp;
        <a>Create a new {title}</a>
      </span>
    );

    return (
      <FormWrapper>
        <InputsWrapper>
          <FormControl
            placeholder="Type to search"
            onChange={e => this.search(e)}
          />
          <ul>
            {datas.map(data => this.renderRow(data, 'plus'))}
            {this.state.loadmore && (
              <LoadMore onClick={this.loadMore}>Load More</LoadMore>
            )}
          </ul>
        </InputsWrapper>
        <ListWrapper>
          <TitleSpan>
            {data.name}&apos;s {title}
          </TitleSpan>
          <ul>{this.state.datas.map(data => this.renderRow(data, 'close'))}</ul>
        </ListWrapper>
        <Modal.Footer>
          <Footer>
            <ModalTrigger title={`New ${title}`} trigger={addTrigger}>
              {form}
            </ModalTrigger>
            <Button btnStyle="simple" onClick={() => this.context.closeModal()}>
              <Icon icon="close" />CANCEL
            </Button>
            <Button btnStyle="success" onClick={this.save}>
              <Icon icon="checkmark" />SAVE
            </Button>
          </Footer>
        </Modal.Footer>
      </FormWrapper>
    );
  }
}

CommonAssociate.propTypes = propTypes;
CommonAssociate.contextTypes = contextTypes;

export default CommonAssociate;