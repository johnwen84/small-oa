import React from 'react';
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from 'carbon-components-react';
import {
  AppSwitcher20,
  Notification20,
  UserAvatar20,
} from '@carbon/icons-react';
import { Link } from 'react-router-dom';

const OAHeader = () => (
  <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
      <Header aria-label="Open Attestation Documents">
        <SkipToContent />
        <HeaderMenuButton
          aria-label="Open menu"
          onClick={onClickSideNavExpand}
          isActive={isSideNavExpanded}
        />
        <HeaderName element={Link} to="/" prefix="IBM - ">
          Open Attestation Documents
        </HeaderName>
        <HeaderNavigation aria-label="Open Attestation Documents" />

        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label="">
            <Notification20 />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="">
            <UserAvatar20 />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="">
            <AppSwitcher20 />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
    )}
  />
);

export default OAHeader;
