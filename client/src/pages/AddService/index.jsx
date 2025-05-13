import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Row, Col, Collapse, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import API from '../../api';

const { Panel } = Collapse;
const { Option } = Select;

export default function AddServices() {
  const [field, setField] = useState({});
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [categoryOption, setCategoryOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [cityOption, setCityOption] = useState([]);

  const [state, setState] = useState({
    error: false,
    message: '',
    heading: '',
    type: 'error',
  });

  const validationError = (message) => {
    setState({ error: true, message, heading: 'Validation Error' });
  };

  useEffect(() => {
    if (state.error) {
      notification.open({
        message: state.heading,
        type: state.type,
        description: state.message,
      });
      setState({ ...state, error: false });
    }
  }, [state.error]);

  const submitData = () => {
    if (
      !field.name ||
      !field.type ||
      !field.experiance ||
      !field.description ||
      !field.street1 ||
      !field.country ||
      !field.state ||
      !field.city ||
      !field.zipcode
    ) {
      validationError('Please fill in all required fields');
      return;
    }
    setLoader(true);
    const tags = field.tag 
  ? field.tag.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
  : [];
    const {
      street1,
      street2,
      type,
      city,
      country,
      state,
      name,
      description,
      experiance,
      tag,
      zipcode,
    } = field;

    // const cityObj = cityOption.filter(
    //   (c) => c.City.toLowerCase() === city.toLowerCase(),
    // )[0];
    // const categoryObj = categoryOption.filter(
    //   (c) => c.name.toLowerCase() === type.toLowerCase(),
    // )[0];
    // const stateObj = stateOption.filter(
    //   (c) => c.state.toLowerCase() === state.toLowerCase(),
    // )[0];

    const cityObj = cityOption.find(
      (c) => c.city?.toLowerCase() === city?.toLowerCase(),
    );

    const categoryObj = categoryOption.find(
      (c) => c.name?.toLowerCase() === type?.toLowerCase(),
    );

    const stateObj = stateOption.find(
      (c) => c.state?.toLowerCase() === state?.toLowerCase(),
    );

    // After you get the filtered objects, you can then access the necessary properties
    // console.log(cityObj, categoryObj, stateObj);

    const data = {
      name,
      tag: tag.split(','),
      experiance,
      type,
      description,
      service_id: name + type + experiance,
      address: name + street1 + city + experiance,
      customers_served: (+city * 12).toString(),
      addressObj: {
        id: name + street1 + city + experiance,
        street1,
        street2,
        country,
        state,
        city,
        zipcode,
        newCountry: { country: 'India', calling_code: '91' },
        newCity: cityObj,
        newState: stateObj,
      },
      typeObj: categoryObj,
    };

    axios
      .post(API.addService, data)
      .then((res) => {
        if (res.data.success) {
          setState({
            error: true,
            message: 'Service/Shop added successfully!!',
            heading: 'Success',
            type: 'success',
          });
          navigate(
            '/home-services/allServices?category=all&state=all&city=&name=',
          );
        } else {
          setState({
            error: true,
            message: 'Server Error !!',
            heading: 'Oops',
            type: 'error',
          });
        }
        setLoader(false);
      })
      .catch((e) => {
        setState({
          error: true,
          message: 'Server Error !!',
          heading: 'Oops',
          type: 'error',
        });
        console.log(e);
        setLoader(false);
      });
  };

  const setFieldFn = (name, value) => {
    setField({ ...field, [name]: value });
  };

  useEffect(() => {
    axios
      .get(API.categories)
      .then((res) => {
        if (res.data.success) {
          setCategoryOption(res.data.data);
        }
      })
      .catch((e) => console.log(e));
    axios
      .get(API.getAllCity)
      .then((res) => {
        if (res.data.success) {
          setCityOption(res.data.data);
        }
      })
      .catch((e) => console.log(e));
    axios
      .get(API.states)
      .then((res) => {
        if (res.data.success) {
          setStateOption(res.data.data);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  // -----------------------------------------------------------

  const filteredCities = React.useMemo(() => {
    if (!field.state) return [];

    return cityOption.filter((city) => {
      const cityState = city?.state?.toLowerCase().trim();
      const selectedState = field.state?.toLowerCase().trim();
      return cityState === selectedState;
    });
  }, [field.state, cityOption]);

  // Debugging - log when state or cities change
  React.useEffect(() => {
    console.log('Current state selection:', field.state);
    console.log('Available cities:', cityOption);
    console.log('Filtered cities:', filteredCities);
  }, [field.state, cityOption, filteredCities]);

  //   const filteredCities = cityOption.filter(
  //   (city) =>
  //     city?.state?.toLowerCase().trim() ===
  //     (field.state || '').toLowerCase().trim(),
  // );

  // console.log('Filtered Cities:', filteredCities);

  // useEffect(() => {
  //   // if (!field.state) {
  //   //   console.log("No state selected yet.");
  //   //   console.log(field.state)
  //   //   return;
  //   // }

  //   console.log('field.state:', field.state);
  //   console.log(
  //     'Available Cities:',
  //     cityOption.map((c) => `${c.city} (${c.state})`),
  //   );

  //   const filteredCities = field.state ? cityOption.filter(
  //     (city) =>
  //       city?.state?.toLowerCase().trim() ===
  //       (field.state || '').toLowerCase().trim()
  //   ):[];

  //   // console.log('Filtered Cities:', filteredCities);

  //   console.log('Filtered Cities based on selected state:', filteredCities);
  // }, [field.state, cityOption]);

  console.log('cityOption type:', Array.isArray(cityOption)); // Should be true

  return (
    <div className='w-[100%] h-[80vh] flex items-start justify-center mt-8'>
      <div className='w-[50%] p-8 bg-white rounded-lg shadow-lg'>
        <Collapse defaultActiveKey={['1', '2']} bordered={false}>
          <Panel header='Service/Shop Information' key='1'>
            <Row gutter={24}>
              <Col span={10} offset={1}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold' }}>
                    Service/Shop Name: *
                  </div>
                  <Input
                    value={field.name}
                    onChange={(e) => setFieldFn('name', e.target.value)}
                    placeholder='Service/Shop Name'
                  />
                </div>
              </Col>
              <Col span={10} offset={1}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold' }}>
                    Category/Type: *
                  </div>
                  <Select
                    value={field.type}
                    onChange={(e) => setFieldFn('type', e)}
                    placeholder='Select Category/Type'
                    style={{ width: '100%', fontWeight: 'normal' }}
                  >
                    {categoryOption.map((c) => (
                      <Option key={c.id}>{c.name}</Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10} offset={1}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold' }}>
                    Total experience: *
                  </div>
                  <Input
                    value={field.experiance}
                    onChange={(e) => setFieldFn('experiance', e.target.value)}
                    placeholder='1 year 6 months'
                  />
                </div>
              </Col>
              <Col span={10} offset={1}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold' }}>
                    Tags:
                  </div>
                  <Input
                    value={field.tag}
                    onChange={(e) => setFieldFn('tag', e.target.value)}
                    placeholder='Cheap, Awesome'
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col offset={1} span={21}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold' }}>
                    Description: *
                  </div>
                  <Input.TextArea
                    value={field.description}
                    onChange={(e) => setFieldFn('description', e.target.value)}
                    placeholder='Enter Description'
                  />
                </div>
              </Col>
            </Row>
          </Panel>
          <Panel header='Address' key='2'>
            <Row gutter={24}>
              <Col span={10} offset={1}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold' }}>
                    Address Line 1: *
                  </div>
                  <Input
                    value={field.street1}
                    onChange={(e) => setFieldFn('street1', e.target.value)}
                    placeholder='Address Line 1'
                  />
                </div>
              </Col>
              <Col span={10} offset={1}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold' }}>
                    Address Line 2:
                  </div>
                  <Input
                    value={field.street2}
                    onChange={(e) => setFieldFn('street2', e.target.value)}
                    placeholder='Address Line 2'
                  />
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10} offset={1}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold' }}>
                    Country: *
                  </div>
                  <Select
                    value={field.country}
                    onChange={(e) => setFieldFn('country', e)}
                    placeholder='Select Country'
                    style={{ width: '100%', fontWeight: 'normal' }}
                  >
                    <Option key='91'>India</Option>
                  </Select>
                </div>
              </Col>
              <Col span={10} offset={1}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold' }}>
                    State: *
                  </div>
                  <Select
                    value={field.state}
                    onChange={(value) => {
                      setField((prev) => ({
                        ...prev,
                        state: value,
                        city: '', // Reset city when state changes
                      }));
                    }}
                    placeholder='Select State'
                    style={{ width: '100%' }}
                  >
                    {stateOption.map((state) => (
                      <Option
                        key={state._id?.$oid || state._id}
                        value={state.state}
                      >
                        {state.state}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10} offset={1}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold' }}>
                    City: *
                  </div>
                  <Select
                    value={field.city}
                    onChange={(value) => setFieldFn('city', value)}
                    placeholder='Select city'
                    style={{ width: '100%' }}
                    disabled={!field.state} // Disable if no state selected
                  >
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <Option
                          key={city._id?.$oid || city._id}
                          value={city.city}
                        >
                          {city.city}
                        </Option>
                      ))
                    ) : (
                      <Option disabled value=''>
                        {field.state
                          ? 'No cities found'
                          : 'Select a state first'}
                      </Option>
                    )}
                  </Select>
                </div>
              </Col>
              <Col span={10} offset={1}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ paddingBottom: '0.5rem', fontWeight: 'bold' }}>
                    Zip code:
                  </div>
                  <Input
                    value={field.zipcode}
                    onChange={(e) => setFieldFn('zipcode', e.target.value)}
                    placeholder='Zip code'
                  />
                </div>
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <div className='flex justify-end mt-4'>
          <Button
            onClick={() => navigate('/home-services/allServices')}
            className='mr-2'
          >
            Cancel
          </Button>
          <Button
            loading={loader}
            type='primary'
            onClick={() => submitData()}
            className='bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded flex items-center'
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
