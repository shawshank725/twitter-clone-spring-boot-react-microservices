import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "@components/Sidebar";
import SearchField from "@components/SearchField";

import '@styles/pages-styles/layout-styles/layout.css';
import '@styles/pages-styles/layout-styles/RightContentContainer.css';

import { useAuth } from "@context/AuthContext";
import { useGenerateFollowSuggestions } from "@api/query/TimelineQueries";
import type { User } from "@/types/Users/User";
import { useEffect, useState } from "react";
import { getUserByUserId } from "@api/service/UserService";
import type { AxiosResponse } from "axios";
import { FollowUser } from "@methods/FollowingMethods";
import { toast } from "react-toastify";

export default function Layout() {
  const { authUser } = useAuth();
  const { data: suggestions, refetch: refetchSuggestions } = useGenerateFollowSuggestions(authUser?.id ?? 0);
  const [users, setUsers] = useState<User[]>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!suggestions || suggestions.length === 0) return;

    const fetchUsers = async () => {
      try {
        const results = await Promise.all(
          suggestions.map((userId: number) => getUserByUserId(userId))
        );
        setUsers(results.map((res: AxiosResponse<User>) => res.data));
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [suggestions]);

  return (
    <div className="homeContainer">
      <Sidebar userInfo={authUser} />
      <main className="middleContentContainer">
        <Outlet />
      </main>
      <div className="rightContentContainer">
        <SearchField />
        {
          suggestions && (
            <div className="followPeopleBox">
              <p>Who to follow</p>
              {
                users && users?.length > 0 ? (
                  users?.map((user: User, index: number) => (
                    <div className="followPeopleUser" key={index} onClick={() => navigate(`/${user.username}`)}>
                      <div style={{ display: "flex", columnGap: "10px" }}>
                        <div className="followPeopleUserProfilePhotoContainer">
                          <img src={user.profilePhoto} className="followPeopleUserProfilePhoto" />
                        </div>
                        <div className="followPeopleUserInfoContainer">
                          <span style={{ fontWeight: "bold" }}>{user.name}</span>
                          <span style={{ color: "grey" }}>{user.username}</span>
                        </div>
                      </div>
                      <button className="followUserButton" onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        if (authUser) {
                          try {
                            const result = await FollowUser(user.id, authUser.id);
                            console.log(result);
                            toast(`Followed ${user.username}`);
                            await refetchSuggestions();
                          }
                          catch (error) {
                            console.log(error);
                          }
                        }
                      }}>Follow</button>
                    </div>
                  ))
                ) : (
                  <p style={{color:"grey", textAlign:'center', fontSize:'15px', marginTop:"20px"}}>No suggestions found.</p>
                )
              }
            </div>
          )
        }
      </div>
    </div>
  );
}