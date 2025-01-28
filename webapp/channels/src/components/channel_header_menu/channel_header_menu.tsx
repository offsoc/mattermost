// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import classNames from 'classnames';
import type {ReactNode} from 'react';
import React from 'react';
import {useIntl} from 'react-intl';
import {useSelector} from 'react-redux';

import ChevronDownIcon from '@mattermost/compass-icons/components/chevron-down';
import type {UserProfile} from '@mattermost/types/users';

import {
    getCurrentChannel,
    isCurrentChannelDefault,
    isCurrentChannelFavorite,
    isCurrentChannelMuted,
} from 'mattermost-redux/selectors/entities/channels';
import {getLicense} from 'mattermost-redux/selectors/entities/general';
import {
    getCurrentUser,
} from 'mattermost-redux/selectors/entities/users';

import {getChannelHeaderMenuPluginComponents} from 'selectors/plugins';

import * as Menu from 'components/menu';

import {Constants} from 'utils/constants';

import ChannelDirectMenu from './channel_header_menu_items/channel_header_direct_menu';
import ChannelGroupMenu from './channel_header_menu_items/channel_header_group_menu';
import ChannelPublicPrivateMenu from './channel_header_menu_items/channel_header_public_private_menu';
import MobileChannelHeaderPlugins from './menu_items/mobile_channel_header_plugins';

import ChannelHeaderTitleDirect from '../channel_header/channel_header_title_direct';
import ChannelHeaderTitleGroup from '../channel_header/channel_header_title_group';

type Props = {
    dmUser?: UserProfile;
    gmMembers?: UserProfile[];
    archivedIcon?: JSX.Element;
    sharedIcon?: JSX.Element;
    isMobile?: boolean;
}

export default function ChannelHeaderMenu(props: Props): JSX.Element | null {
    const intl = useIntl();

    const user = useSelector(getCurrentUser);
    const channel = useSelector(getCurrentChannel);
    const isDefault = useSelector(isCurrentChannelDefault);
    const isFavorite = useSelector(isCurrentChannelFavorite);
    const isMuted = useSelector(isCurrentChannelMuted);
    const isLicensedForLDAPGroups = useSelector(getLicense).LDAPGroups === 'true';
    const pluginMenuItems = useSelector(getChannelHeaderMenuPluginComponents);

    const isReadonly = false;
    const {dmUser, gmMembers, isMobile, archivedIcon, sharedIcon} = props;

    if (!channel) {
        return null;
    }

    const isDirect = (channel.type === Constants.DM_CHANNEL);
    const isGroup = (channel.type === Constants.GM_CHANNEL);

    let channelTitle: ReactNode = channel.display_name;
    if (isDirect) {
        channelTitle = <ChannelHeaderTitleDirect dmUser={dmUser}/>;
    } else if (isGroup) {
        channelTitle = <ChannelHeaderTitleGroup gmMembers={gmMembers}/>;
    }

    const pluginItems = pluginMenuItems.map((item) => {
        return (
            <Menu.Item
                id={item.id + '_pluginmenuitem'}
                key={item.id + '_pluginmenuitem'}
                onClick={() => {
                    if (item.action) {
                        item.action(channel.id);
                    }
                }}
                labels={<span>{item.text}</span>}
            />
        );
    });

    return (
        <Menu.Container
            menuButtonTooltip={{
                text: channelTitle as string,
            }}
            menuButton={{
                id: 'channelHeaderDropdownButton',
                class: classNames('channel-header__trigger style--none'),
                children: (
                    <>
                        {archivedIcon}
                        {channelTitle as string}
                        {sharedIcon}
                        <ChevronDownIcon size={16}/>
                    </>
                ),
                'aria-label': intl.formatMessage({
                    id: 'channel_header.menuAriaLabel',
                    defaultMessage: 'Channel Menu',
                }),
            }}
            menu={{
                id: 'channelHeaderMenu',
            }}
            transformOrigin={{
                horizontal: 'left',
                vertical: 'top',
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            {isDirect && (
                <ChannelDirectMenu
                    channel={channel}
                    user={user}
                    isMuted={isMuted}
                    pluginItems={pluginItems}
                    isFavorite={isFavorite}
                    isMobile={isMobile || false}
                />
            )}
            {isGroup && (
                <ChannelGroupMenu
                    channel={channel}
                    user={user}
                    isMuted={isMuted}
                    pluginItems={pluginItems}
                    isFavorite={isFavorite}
                    isMobile={isMobile || false}
                />
            )}
            {(!isDirect && !isGroup) && (
                <ChannelPublicPrivateMenu
                    channel={channel}
                    user={user}
                    isMuted={isMuted}
                    pluginItems={pluginItems}
                    isFavorite={isFavorite}
                    isMobile={isMobile || false}
                    isReadonly={isReadonly}
                    isDefault={isDefault}
                    isLicensedForLDAPGroups={isLicensedForLDAPGroups}
                />
            )}

            {isMobile && pluginItems}
            {isMobile && (
                <MobileChannelHeaderPlugins
                    channel={channel}
                    isDropdown={true}
                />
            )}
        </Menu.Container>
    );
}

