import '@styles/components-styles/Sidebar.css';
import  NavigationItem  from '@/components/NavigationItem';
import { Ellipsis, LogOut} from 'lucide-react';
import PostButton from '@/components/posts/PostButton';
import type { User } from '@/types/Users/User';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PostModal from '@/components/posts/PostModal';
import useOutsideAlerter from '@hooks/useOutsideAlerter';
import { TWITTER_LOGO_PATH } from '@constants/PhotoUrls';
import { useGetUnreadNotificationsCount } from '@/api/query/NotificationQueries';

import { HomeIcon as HomeIconOutline } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid }   from "@heroicons/react/24/solid";

import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid }   from "@heroicons/react/24/solid";

import { BellIcon as BellIconOutline } from "@heroicons/react/24/outline";
import { BellIcon as BellIconSolid }   from "@heroicons/react/24/solid";

import { Cog6ToothIcon as SettingsIconOutline } from "@heroicons/react/24/outline";
import { Cog6ToothIcon as SettingsIconSolid }   from "@heroicons/react/24/solid";

import { UserIcon as UserIconOutline } from "@heroicons/react/24/outline";
import { UserIcon as UserIconSolid }   from "@heroicons/react/24/solid";

import { MagnifyingGlassCircleIcon as ExploreIconOutline } from "@heroicons/react/24/outline";
import { MagnifyingGlassCircleIcon as ExploreIconSolid }   from "@heroicons/react/24/solid";



type UserInfoProp = {
    userInfo?: User | null;
}


export default function Sidebar({userInfo}: UserInfoProp) {
    const [showDialogBox, setShowDialogBox] = useState<boolean>(false);
    const [showPostModal, setShowPostModal] = useState<boolean>(false);

    const {ref: postModalRef} = useOutsideAlerter<HTMLDivElement>(setShowPostModal, undefined);

    const navigate = useNavigate();
    const location = useLocation();
    
    const { data: unreadNotificationsCount } = useGetUnreadNotificationsCount(userInfo?.id ?? 0);

    const logout =() => {
        localStorage.removeItem("authToken");
        navigate("/auth", {replace: true});
        toast("Logout successful!");
    }

    return (
        <header className='sidebarContainer'>
            <div className='sidebar'>
                <img src={TWITTER_LOGO_PATH} className='appLogoSmall' alt='Twitter Logo'/>
                <div className='navigationItemContainer'>
                    <NavigationItem navigationItem={{
                        title: "Home",
                        iconOutlined: <HomeIconOutline width={25} />,
                        iconSolid: <HomeIconSolid width={25}/>,
                        url: "/home"
                    }} 
                    isActive={location.pathname === "/home"}
                    />
                    <NavigationItem navigationItem={{
                        title: "Explore",
                        iconOutlined: <ExploreIconOutline  width={25}/>,
                        iconSolid: <ExploreIconSolid width={25} />,
                        url: `/search`
                    }} 
                    isActive={location.pathname === `/search`}
                    />
                    
                    <NavigationItem navigationItem={{
                        title: "Profile",
                        iconOutlined: <UserIconOutline  width={25}/>,
                        iconSolid: <UserIconSolid width={25} />,
                        url: `/${userInfo?.username}`
                    }} 
                    isActive={location.pathname === `/${userInfo?.username}`}
                    />

                    <NavigationItem navigationItem={{
                        title: "Bookmarks",
                        iconOutlined: <BookmarkIconOutline width={25} />,
                        iconSolid: <BookmarkIconSolid width={25} />,
                        url: '/bookmarks'
                    }} 
                    isActive={location.pathname === '/bookmarks'}
                    />

                    <NavigationItem navigationItem={{
                        title: "Notifications",
                        iconOutlined: <BellIconOutline width={25} />,
                        iconSolid: <BellIconSolid width={25} />,
                        url: '/notifications',
                    }} 
                    isActive={location.pathname === '/notifications'}
                    numberIndicator={unreadNotificationsCount}
                    />
                    
                    <NavigationItem navigationItem={{
                        title: "Settings",
                        iconOutlined: <SettingsIconOutline width={25} />,
                        iconSolid: <SettingsIconSolid width={25} />,
                        url: '/settings'
                    }} 
                    isActive={location.pathname === '/settings'}
                    />
                    
                    <PostButton value={showPostModal} setValue={setShowPostModal}/>

                    <div className='sidebarProfileContainer' onClick={()=> {setShowDialogBox(!showDialogBox)}}>
                        <div className='sidebarProfilePhotoUsernameContainer'>
                            <div className='sidebarProfilePhotoContainer'>
                                <img src={userInfo?.profilePhoto} className='sidebarProfilePhoto'/> 
                            </div>
                            <div className='sidebarUsernameFullNameContainer'>
                                <span className='sidebarUserFullName'>{userInfo?.name}</span>
                                <span className='sidebarUserusername'>@{userInfo?.username}</span>
                            </div>
                        </div>
                        <div className='ellipsisContainer'>
                            <Ellipsis />
                        </div>
                    </div>
                    
                    {
                        showDialogBox && 
                        <div className='sidebarDialogBox'>
                            <div className='sidebarLogoutBox' onClick={()=> navigate(`/${userInfo?.username}`) }>
                                <LogOut/> View Profile 
                            </div>
                            <div className='sidebarLogoutBox' onClick={()=> logout()}>
                                <LogOut/> Logout 
                            </div>
                        </div>
                    }
                </div>
            </div>
            {
                userInfo && showPostModal && (
                    <PostModal userInfo={userInfo} 
                        isVisible={showPostModal}
                        setIsVisible={setShowPostModal}
                        refer={postModalRef}
                        doingQuoteRetweet={false}
                        doingReply={false}
                    />
                )
            }
        </header>
    )
}
