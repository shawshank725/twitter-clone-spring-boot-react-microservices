USE `notifications`;

DELIMITER //

CREATE TRIGGER prune_notifications_after_insert
AFTER INSERT ON notifications
FOR EACH ROW
BEGIN
    DECLARE unread_count INT;
    DECLARE total_count INT;
    DECLARE excess_count INT;

    -- Count unread for this user
    SELECT COUNT(*) INTO unread_count
    FROM notifications
    WHERE notified_user_id = NEW.notified_user_id
      AND notification_status = 'UNREAD';

    -- Count total for this user
    SELECT COUNT(*) INTO total_count
    FROM notifications
    WHERE notified_user_id = NEW.notified_user_id;

    -- If more than allowed total, delete oldest read ones
    IF total_count > (unread_count + 20) THEN
        SET excess_count = total_count - (unread_count + 20);

        DELETE FROM notifications
        WHERE notification_id IN (
            SELECT notification_id
            FROM (
                SELECT notification_id
                FROM notifications
                WHERE notified_user_id = NEW.notified_user_id
                  AND notification_status = 'READ'
                ORDER BY created_at ASC
                LIMIT excess_count
            ) AS sub
        );
    END IF;
END;
//

DELIMITER ;
