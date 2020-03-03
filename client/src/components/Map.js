import React, { Component } from "react";
import ReactMapGL from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { GeoJsonLayer } from "deck.gl";
import { connect } from "react-redux";
import { postActions } from "../actions/postActions";

class Map extends Component {
  state = {
    viewport: {
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    },
    searchResultLayer: null
  };

  mapRef = React.createRef();

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };
  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  handleOnResult = event => {
    const { text, geometry } = event.result;
    const { dispatch } = this.props;
    dispatch(postActions.mapLoactionSelect({ text, geometry }));
    this.setState({
      searchResultLayer: new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10
      })
    });
  };

  render() {
    const { viewport } = this.state;
    return (
      <ReactMapGL
        ref={this.mapRef}
        mapboxApiAccessToken={
          "pk.eyJ1Ijoiam9obmJvcyIsImEiOiJjanl1b3l1MmkwaDdnM2pwaG5yNm1mZmlrIn0.O7X5QEcRO2ncLo_vLMVeTQ"
        }
        width="100%"
        height="35rem"
        {...viewport}
        onViewportChange={this.handleViewportChange}
      >
        <Geocoder
          limit={5}
          mapRef={this.mapRef}
          onResult={this.handleOnResult}
          onViewportChange={this.handleGeocoderViewportChange}
          mapboxApiAccessToken={
            "pk.eyJ1Ijoiam9obmJvcyIsImEiOiJjanl1b3l1MmkwaDdnM2pwaG5yNm1mZmlrIn0.O7X5QEcRO2ncLo_vLMVeTQ"
          }
        />
      </ReactMapGL>
    );
  }
}

const connectedMap = connect(null)(Map);
export { connectedMap as Map };
