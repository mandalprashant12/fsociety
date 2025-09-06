import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Video, Phone, MapPin, Calendar, ExternalLink, Mic, MicOff, VideoOff, VideoIcon } from 'lucide-react';
import { Meeting } from '@/types/task';
import { format, isAfter, isBefore, addMinutes } from 'date-fns';

interface MeetingCardProps {
  meeting: Meeting;
  onJoin?: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
  onDelete?: (meetingId: string) => void;
}

const MeetingCard: FC<MeetingCardProps> = ({ meeting, onJoin, onEdit, onDelete }) => {
  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      case 'hybrid': return <Video className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'declined': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'tentative': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const isUpcoming = isAfter(meeting.startTime, new Date());
  const isStartingSoon = isAfter(meeting.startTime, new Date()) && isBefore(meeting.startTime, addMinutes(new Date(), 15));
  const isOngoing = isBefore(meeting.startTime, new Date()) && isAfter(meeting.endTime, new Date());
  const isEnded = isAfter(meeting.endTime, new Date());

  const getTimeStatus = () => {
    if (isOngoing) return { text: 'In Progress', color: 'text-green-400' };
    if (isStartingSoon) return { text: 'Starting Soon', color: 'text-yellow-400' };
    if (isEnded) return { text: 'Ended', color: 'text-slate-400' };
    return { text: 'Upcoming', color: 'text-blue-400' };
  };

  const timeStatus = getTimeStatus();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200 ${
        isOngoing ? 'ring-2 ring-green-500/50' : isStartingSoon ? 'ring-2 ring-yellow-500/50' : ''
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="mt-1">
                {getMeetingTypeIcon(meeting.meetingType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-lg text-white truncate">
                    {meeting.title}
                  </h3>
                  <Badge className={timeStatus.color}>
                    {timeStatus.text}
                  </Badge>
                </div>
                
                {meeting.description && (
                  <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                    {meeting.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(meeting.startTime, 'MMM dd, h:mm a')} - {format(meeting.endTime, 'h:mm a')}
                    </span>
                  </div>
                  
                  {meeting.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{meeting.location}</span>
                    </div>
                  )}
                </div>

                {/* Meeting Settings */}
                <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3">
                  <div className="flex items-center space-x-1">
                    {meeting.meetingSettings.autoMute ? (
                      <MicOff className="h-3 w-3" />
                    ) : (
                      <Mic className="h-3 w-3" />
                    )}
                    <span>Mic {meeting.meetingSettings.autoMute ? 'Off' : 'On'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {meeting.meetingSettings.autoVideoOff ? (
                      <VideoOff className="h-3 w-3" />
                    ) : (
                      <VideoIcon className="h-3 w-3" />
                    )}
                    <span>Video {meeting.meetingSettings.autoVideoOff ? 'Off' : 'On'}</span>
                  </div>
                </div>

                {/* Attendees */}
                {meeting.attendees && meeting.attendees.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 text-sm text-slate-400">
                      <Users className="h-4 w-4" />
                      <span>Attendees ({meeting.attendees.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.slice(0, 3).map((attendee, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <div className="h-6 w-6 rounded-full bg-slate-600 flex items-center justify-center">
                            <span className="text-xs text-white">
                              {attendee.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs text-slate-300">{attendee.name}</span>
                          <Badge className={`text-xs ${getStatusColor(attendee.status)}`}>
                            {attendee.status}
                          </Badge>
                        </div>
                      ))}
                      {meeting.attendees.length > 3 && (
                        <div className="text-xs text-slate-400">
                          +{meeting.attendees.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {meeting.meetingLink && (isUpcoming || isOngoing) && (
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => onJoin?.(meeting)}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Join
                </Button>
              )}
            </div>
          </div>
          
          {/* Meeting Link */}
          {meeting.meetingLink && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Meeting Link:</span>
                  <code className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-300">
                    {meeting.meetingLink}
                  </code>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                  onClick={() => navigator.clipboard.writeText(meeting.meetingLink!)}
                >
                  Copy
                </Button>
              </div>
            </div>
          )}

          {/* Meeting Notes */}
          {meeting.notes && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <h4 className="text-sm font-medium text-white mb-2">Notes</h4>
              <p className="text-sm text-slate-300">{meeting.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MeetingCard;
